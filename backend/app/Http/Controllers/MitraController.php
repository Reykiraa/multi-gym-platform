<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Mitra;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MitraController extends Controller
{
    /**
     * Get all mitra organizations (Admin only).
     *
     * Returns a list of mitra brands with gym and branch account counts,
     * sufficient for both the admin Mitra Manager page and the GymForm dropdown.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $mitras = Mitra::withCount(['gyms', 'branchAccounts'])
            ->latest()
            ->get();

        return response()->json($mitras, 200);
    }

    /**
     * Get a specific mitra organization by ID.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function show(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $mitra = Mitra::with(['gyms', 'branchAccounts'])->findOrFail($id);

        return response()->json($mitra, 200);
    }

    /**
     * Register a new mitra organization.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'contact_email' => 'nullable|string|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'address'       => 'nullable|string',
            'description'   => 'nullable|string',
        ]);

        $mitra = Mitra::create($validated);

        return response()->json([
            'message' => 'Mitra berhasil didaftarkan',
            'mitra'   => $mitra,
        ], 201);
    }

    /**
     * Update an existing mitra organization.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $mitra = Mitra::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'contact_email' => 'nullable|string|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'address'       => 'nullable|string',
            'description'   => 'nullable|string',
        ]);

        $mitra->update($validated);

        return response()->json($mitra, 200);
    }

    /**
     * Delete a mitra organization.
     * gyms and branch accounts with this mitra_org_id will be nulled (nullOnDelete).
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $mitra = Mitra::findOrFail($id);
        $mitra->delete();

        return response()->json(['message' => 'Mitra berhasil dihapus'], 200);
    }
}
