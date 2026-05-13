<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_payroll_item_id')->nullable()->constrained()->onDelete('set null');
            $table->string('description');
            $table->enum('type', ['credit', 'debit']);
            $table->enum('calculation_type', ['fixed', 'percentage']);
            $table->decimal('amount', 12, 2)->default(0);
            $table->decimal('percentage', 5, 2)->nullable();
            $table->decimal('calculated_amount', 12, 2)->default(0);
            $table->timestamps();
            $table->index('payroll_id');
            $table->index('employee_payroll_item_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
    }
};
