<?php

use App\Models\SheetsCustom;
use App\Services\Google\GoogleSheetsService;

class GoogleSheetManager
{
    public function __construct(private GoogleSheetsService $service) {}

    public function getOrCreateOrdersSheet(): SheetsCustom
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

}
