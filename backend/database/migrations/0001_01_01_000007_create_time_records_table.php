<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('record_date');
            $table->time('entry_time')->nullable();
            $table->time('exit_time')->nullable();
            $table->time('lunch_start')->nullable();
            $table->time('lunch_end')->nullable();
            $table->decimal('overtime', 5, 2)->default(0);
            $table->decimal('bank_hours', 5, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            $table->unique(['employee_id', 'record_date']);
            $table->index('record_date');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('time_records');
    }
};
