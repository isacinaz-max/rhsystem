<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recruitments', function (Blueprint $table) {
            $table->id();
            $table->string('position');
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->string('salary_range', 100)->nullable();
            $table->enum('status', ['aberto', 'em_andamento', 'fechado', 'cancelado'])->default('aberto');
            $table->date('open_date')->nullable();
            $table->date('close_date')->nullable();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            $table->index('status');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('recruitments');
    }
};
