<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            if (!Schema::hasColumn('payrolls', 'competence')) {
                $table->string('competence', 7)->nullable()->after('employee_id');
            }
            if (!Schema::hasColumn('payrolls', 'total_credit')) {
                $table->decimal('total_credit', 12, 2)->default(0)->after('net_salary');
            }
            if (!Schema::hasColumn('payrolls', 'total_debit')) {
                $table->decimal('total_debit', 12, 2)->default(0)->after('total_credit');
            }
            if (!Schema::hasColumn('payrolls', 'observations')) {
                $table->text('observations')->nullable()->after('payment_date');
            }
            if (Schema::hasColumn('payrolls', 'status')) {
                $table->string('payment_status', 20)->nullable()->after('observations');
            }
        });
    }
    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropColumn(['competence', 'total_credit', 'total_debit', 'observations', 'payment_status']);
        });
    }
};
