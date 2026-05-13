<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('benefit_id')->nullable()->constrained()->onDelete('set null');
            $table->string('description');
            $table->enum('type', ['credit', 'debit']);
            $table->enum('calculation_type', ['fixed', 'percentage']);
            $table->decimal('amount', 12, 2)->default(0);
            $table->decimal('percentage', 5, 2)->nullable();
            $table->boolean('reference_salary')->default(false);
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->index('employee_id');
            $table->index('benefit_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('employee_payroll_items');
    }
};
