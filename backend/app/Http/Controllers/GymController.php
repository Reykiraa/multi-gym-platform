<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Gym;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GymController extends Controller
{
    /**
     * Display a listing of the gyms.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $gyms = Gym::all();
        
        return response()->json($gyms, 200);
    }

    /**
     * Display the specified gym.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $gym = Gym::with('mitra')->findOrFail($id);
        
        return response()->json($gym, 200);
    }

    /**
     * Store a newly created gym in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY GATE: Wajib dibatasi hanya untuk role admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'mitra_name' => 'required|string|max:255',
            'mitra_email' => 'required|string|email|unique:users,email',
            'mitra_password' => 'nullable|string|min:8',
            'name' => 'required|string|max:255',
            'location' => 'required|string',
            'facilities' => 'required|array',
            'credit_price' => 'required|integer|min:1',
        ]);

        $result = \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
            $newMitra = \App\Models\User::create([
                'name' => $validated['mitra_name'],
                'email' => $validated['mitra_email'],
                'password' => $validated['mitra_password'] ?? 'Gym1234!',
                'role' => 'mitra',
            ]);

            $gym = Gym::create([
                'mitra_id' => $newMitra->id,
                'name' => $validated['name'],
                'location' => $validated['location'],
                'facilities' => $validated['facilities'],
                'credit_price' => $validated['credit_price'],
            ]);

            return ['gym' => $gym, 'mitra' => $newMitra];
        });

        return response()->json([
            'message' => 'Gym created successfully',
            'gym' => $result['gym'],
            'mitra' => $result['mitra']
        ], 201);
    }

    /**
     * Store a new gym branch with a dedicated new mitra account.
     *
     * Each branch receives its own mitra account so branch managers can
     * independently validate PINs and manage their location.
     * Password defaults to 'Gym1234!' when not provided.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function storeBranch(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'mitra_org_id'    => 'required|integer|exists:mitras,id',
            'branch_name'     => 'required|string|max:255',
            'branch_email'    => 'required|string|email|unique:users,email',
            'branch_password' => 'nullable|string|min:8',
            'name'            => 'required|string|max:255',
            'location'        => 'required|string',
            'facilities'      => 'required|array',
            'credit_price'    => 'required|integer|min:1',
        ]);

        $result = \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
            // Create a dedicated branch manager account linked to the mitra org
            $branchMitra = \App\Models\User::create([
                'name'          => $validated['branch_name'],
                'email'         => $validated['branch_email'],
                'password'      => $validated['branch_password'] ?? 'Gym1234!',
                'role'          => 'mitra',
                'mitra_org_id'  => $validated['mitra_org_id'],
            ]);

            $gym = Gym::create([
                'mitra_id'     => $branchMitra->id,
                'mitra_org_id' => $validated['mitra_org_id'],
                'name'         => $validated['name'],
                'location'     => $validated['location'],
                'facilities'   => $validated['facilities'],
                'credit_price' => $validated['credit_price'],
            ]);

            return ['gym' => $gym, 'mitra' => $branchMitra];
        });

        return response()->json([
            'message' => 'Cabang gym berhasil ditambahkan',
            'gym'     => $result['gym'],
            'mitra'   => $result['mitra'],
        ], 201);
    }

    /**
     * Update the specified gym in storage.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // SECURITY GATE: Wajib dibatasi hanya untuk role admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gym = Gym::find($id);

        if (!$gym) {
            return response()->json(['message' => 'Gym not found'], 404);
        }

        $validated = $request->validate([
            'mitra_id' => 'sometimes|integer|exists:users,id',
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string',
            'facilities' => 'sometimes|array',
            'credit_price' => 'sometimes|integer|min:1',
        ]);

        $gym->update($validated);

        return response()->json($gym, 200);
    }

    /**
     * Remove the specified gym from storage.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        // SECURITY GATE: Wajib dibatasi hanya untuk role admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gym = Gym::find($id);

        if (!$gym) {
            return response()->json(['message' => 'Gym not found'], 404);
        }

        $gym->delete();

        return response()->json(['message' => 'Gym deleted successfully'], 200);
    }

    /**
     * Get the gym associated with the currently authenticated mitra.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function myGym(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'mitra') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // A mitra is linked to gyms via mitra_id
        $gym = Gym::where('mitra_id', $request->user()->id)->first();

        if (!$gym) {
            return response()->json(['message' => 'Data Gym tidak ditemukan'], 404);
        }

        return response()->json(['data' => $gym], 200);
    }

    /**
     * Update the gym associated with the currently authenticated mitra.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateMyGym(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'mitra') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gym = Gym::where('mitra_id', $request->user()->id)->first();

        if (!$gym) {
            return response()->json(['message' => 'Data Gym tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string',
            'facilities' => 'sometimes|array',
            'photos' => 'sometimes|array',
        ]);

        $gym->update($validated);

        return response()->json(['message' => 'Profil Gym berhasil diperbarui', 'data' => $gym], 200);
    }
}
