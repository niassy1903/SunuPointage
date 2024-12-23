<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function index()
    {
        return Departement::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            'annee_creation' => 'required|date',
            'description' => 'nullable',
        ]);

        return Departement::create($request->all());
    }

    public function show($id)
    {
        return Departement::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $departement = Departement::findOrFail($id);
        $request->validate([
            'nom' => 'sometimes|required',
            'annee_creation' => 'sometimes|required|date',
            'description' => 'nullable',
        ]);

        $departement->update($request->all());
        return $departement;
    }

    public function destroy($id)
    {
        $departement = Departement::findOrFail($id);
        $departement->delete();
        return response()->json(null, 204);
    }
}
