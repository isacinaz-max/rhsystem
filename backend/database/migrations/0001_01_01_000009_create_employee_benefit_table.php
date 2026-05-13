<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_benefit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('benefit_id')->constrained()->onDelete('cascade');
            $table->date('granted_date')->nullable();
            $table->timestamps();
            $table->unique(['employee_id', 'benefit_id']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('employee_benefit');
    }
};
