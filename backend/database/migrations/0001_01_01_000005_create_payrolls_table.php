<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->integer('reference_month');
            $table->integer('reference_year');
            $table->decimal('base_salary', 12, 2)->default(0);
            $table->decimal('benefits_total', 12, 2)->default(0);
            $table->decimal('discounts_total', 12, 2)->default(0);
            $table->decimal('inss', 12, 2)->default(0);
            $table->decimal('fgts', 12, 2)->default(0);
            $table->decimal('irrf', 12, 2)->default(0);
            $table->decimal('transportation_vouchers', 12, 2)->default(0);
            $table->decimal('meal_vouchers', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2)->default(0);
            $table->enum('status', ['pendente', 'processado', 'pago', 'cancelado'])->default('pendente');
            $table->date('payment_date')->nullable();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['reference_month', 'reference_year']);
            $table->index('employee_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
