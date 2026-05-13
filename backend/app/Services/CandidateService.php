<?php

namespace App\Services;

use App\Models\Candidate;
use App\Repositories\CandidateRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CandidateService
{
    public function __construct(private CandidateRepository $candidateRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->candidateRepository->all($filters);
    }

    public function find(int $id): ?Candidate
    {
        return $this->candidateRepository->findById($id);
    }

    public function create(array $data): Candidate
    {
        if (isset($data['resume']) && $data['resume'] instanceof \Illuminate\Http\UploadedFile) {
            $data['resume'] = $data['resume']->store('candidates/resumes', 'public');
        }
        return $this->candidateRepository->create($data);
    }

    public function update(Candidate $candidate, array $data): Candidate
    {
        if (isset($data['resume']) && $data['resume'] instanceof \Illuminate\Http\UploadedFile) {
            if ($candidate->resume) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($candidate->resume);
            }
            $data['resume'] = $data['resume']->store('candidates/resumes', 'public');
        }
        $this->candidateRepository->update($candidate, $data);
        return $candidate->fresh('recruitment');
    }

    public function delete(Candidate $candidate): bool
    {
        if ($candidate->resume) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($candidate->resume);
        }
        return $this->candidateRepository->delete($candidate);
    }
}
