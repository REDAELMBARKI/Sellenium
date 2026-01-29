<?php

namespace App\Http\Controllers;

use App\Models\SheetsCustom;
use App\Services\Google\GoogleSheetsService;
use Illuminate\Http\Request;

class GoogleSheetsController extends Controller
{
    public function __construct(private GoogleSheetsService $service) {}

    private function getOrCreateOrdersSheet(): SheetsCustom
    {
        return SheetsCustom::firstOrCreate(
                ['key' => 'orders'],
                function () {
                    // create the sheet
                    $spreadsheetId = $this->service->createOrderSheet('Orders');
                    
                    // return array to fill in DB
                    return [
                        'spreadsheet_id' => $spreadsheetId,
                        'spreadsheet_url' => "https://docs.google.com/spreadsheets/d/{$spreadsheetId}"
                    ];
                }
        );
    }

    public function createOrderSheet(){
        $sheet =  $this->getOrCreateOrdersSheet();
        return redirect()->back()->with('success', "Orders sheet created! <a href='{$sheet->spreadsheet_url}' target='_blank'>Open Sheet</a>");
    }
}
