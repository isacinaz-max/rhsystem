<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('days');
            $table->string('period', 50)->nullable();
            $table->enum('status', ['solicitada', 'aprovada', 'rejeitada', 'cancelada'])->default('solicitada');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->index('employee_id');
            $table->index('status');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('vacations');
    }
};
