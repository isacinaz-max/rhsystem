<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(private UserService $userService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);
        $result = $this->userService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);
        $user = $this->userService->create($request->validated());
        return $this->success($user, 'Usuário cadastrado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->find($id);
        if (!$user) {
            return $this->error('Usuário não encontrado', 404);
        }
        $this->authorize('view', $user);
        return $this->success($user);
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->find($id);
        if (!$user) {
            return $this->error('Usuário não encontrado', 404);
        }
        $this->authorize('update', $user);
        $user = $this->userService->update($user, $request->validated());
        return $this->success($user, 'Usuário atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $user = $this->userService->find($id);
        if (!$user) {
            return $this->error('Usuário não encontrado', 404);
        }
        $this->authorize('delete', $user);
        $this->userService->delete($user);
        return $this->success(null, 'Usuário removido com sucesso');
    }
}
