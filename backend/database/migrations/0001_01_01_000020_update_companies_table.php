<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('razao_social')->nullable()->after('name');
            $table->string('nome_fantasia')->nullable()->after('razao_social');
            $table->string('inscricao_estadual', 20)->nullable()->after('cnpj');
            $table->string('telefone', 20)->nullable()->after('inscricao_estadual');
            $table->string('email')->nullable()->after('telefone');
            $table->string('cep', 10)->nullable()->after('email');
            $table->string('endereco')->nullable()->after('cep');
            $table->string('numero', 10)->nullable()->after('endereco');
            $table->string('bairro')->nullable()->after('numero');
            $table->string('cidade')->nullable()->after('bairro');
            $table->string('estado', 2)->nullable()->after('cidade');
            $table->string('logo')->nullable()->after('estado');
        });
        Schema::table('companies', function (Blueprint $table) {
            $table->renameColumn('name', 'nome_fantasia_old');
        });
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('nome_fantasia_old');
        });
    }
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn([
                'razao_social', 'nome_fantasia', 'inscricao_estadual',
                'telefone', 'email', 'cep', 'endereco', 'numero',
                'bairro', 'cidade', 'estado', 'logo'
            ]);
        });
    }
};
