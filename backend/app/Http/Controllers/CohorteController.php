<?php

namespace App\Http\Controllers;

use App\Models\Cohorte;
use Illuminate\Http\Request;

class CohorteController extends Controller
{
    public function index()
    {
        return Cohorte::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            'annee_creation' => 'required|date',
            'description' => 'nullable',
        ]);

        return Cohorte::create($request->all());
    }

    public function show($id)
    {
        return Cohorte::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $cohorte = Cohorte::findOrFail($id);
        $request->validate([
            'nom' => 'sometimes|required',
            'annee_creation' => 'sometimes|required|date',
            'description' => 'nullable',
        ]);

        $cohorte->update($request->all());
        return $cohorte;
    }

    public function destroy($id)
    {
        $cohorte = Cohorte::findOrFail($id);
        $cohorte->delete();
        return response()->json(null, 204);
    }
}
