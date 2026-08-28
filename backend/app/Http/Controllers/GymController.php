<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Gym;
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
            'mitra_id' => 'required|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'location' => 'required|string',
            'facilities' => 'required|array',
            'credit_price' => 'required|integer|min:1',
        ]);

        $gym = Gym::create($validated);

        return response()->json($gym, 201);
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
}
