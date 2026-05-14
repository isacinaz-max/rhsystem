<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!auth()->check()) {
            return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);
        }
        $user = auth()->user();
        if ($user->is_super_admin || $user->role === 'administrador') {
            return $next($request);
        }
        $permissions = [
            'administrador' => ['*'],
            'rh' => ['view', 'create', 'edit'],
            'gestor' => ['view', 'edit'],
            'funcionario' => ['view'],
        ];
        $userPermissions = $permissions[$user->role] ?? [];
        if (in_array('*', $userPermissions) || in_array($permission, $userPermissions)) {
            return $next($request);
        }
        return response()->json(['success' => false, 'message' => 'Sem permissão para esta ação'], 403);
    }
}
