<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recruitment_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('resume')->nullable();
            $table->enum('status', ['recebido', 'em_analise', 'entrevistado', 'aprovado', 'rejeitado'])->default('recebido');
            $table->timestamp('interview_date')->nullable();
            $table->text('interview_notes')->nullable();
            $table->text('observations')->nullable();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            $table->index('recruitment_id');
            $table->index('status');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
