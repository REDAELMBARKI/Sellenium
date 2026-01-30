<?php

namespace App\Services\Google;

use App\Http\Controllers\SheetsController;
use Exception;
use Google\Client;
use Google\Service\Sheets;
use Google_Client;
use Google_Service_Drive;

class GoogleSheetsService
{
    protected $service ;
    public function __construct(Google_Client $client) {
        $client->
        $client->setAccessType('offline');
        // ONLY FOR LOCAL DEVELOPMENT - REMOVE IN PRODUCTION
        $httpClient = new \GuzzleHttp\Client(['verify' => false]);
        $client->setHttpClient($httpClient);
        $service = new Sheets($client);
    }

    public function createOrderSheet(Google_Client $client  , $sheetName = 'orders'){
        $client->setScopes([Sheets::SPREADSHEETS]);
        $sheet = new Sheets\Spreadsheet([
         'properties' => [
                'title' => $sheetName
            ]
        ]) ;

        $createdSheet = $this->service->spreadsheets->create($sheet);
        $spreadSheetId = $createdSheet->spreadsheetId ;
        $this->setupHeaders($spreadSheetId);
        return $spreadSheetId;
    }


    public function setupHeaders($spreadsheetId, $sheetName = 'orders')
    {
        // Add headers
        $headers = [
            ['Order ID', 'Customer Name', 'Email', 'Total', 'Status', 'Created At']
        ];
        
        $body = new Sheets\ValueRange(['values' => $headers]);
        
        $this->service->spreadsheets_values->update(
            $spreadsheetId,
            "{$sheetName}!A1",
            $body,
            ['valueInputOption' => 'RAW']
        );
        
        // Get sheet ID
        $spreadsheet = $this->service->spreadsheets->get($spreadsheetId);
        $sheetId = $spreadsheet->getSheets()[0]->getProperties()->sheetId;
        
        // Define colors for each column
        $columnColors = [
            // Column A (Order ID) - Light Blue
            ['red' => 0.7, 'green' => 0.85, 'blue' => 1.0],
            
            // Column B (Customer Name) - Light Green
            ['red' => 0.7, 'green' => 1.0, 'blue' => 0.8],
            
            // Column C (Email) - Light Yellow
            ['red' => 1.0, 'green' => 0.95, 'blue' => 0.7],
            
            // Column D (Total) - Light Orange
            ['red' => 1.0, 'green' => 0.85, 'blue' => 0.7],
            
            // Column E (Status) - Light Purple
            ['red' => 0.9, 'green' => 0.8, 'blue' => 1.0],
            
            // Column F (Created At) - Light Pink
            ['red' => 1.0, 'green' => 0.8, 'blue' => 0.9]
        ];
        
        $requests = [];
        
        // Create a separate request for each column
        foreach ($columnColors as $columnIndex => $color) {
            $requests[] = new Sheets\Request([
                'repeatCell' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => 0,
                        'endRowIndex' => 1,
                        'startColumnIndex' => $columnIndex,      // Specific column
                        'endColumnIndex' => $columnIndex + 1     // Only this column
                    ],
                    'cell' => [
                        'userEnteredFormat' => [
                            'backgroundColor' => $color,
                            'textFormat' => [
                                'bold' => true,
                                'foregroundColor' => [
                                    'red' => 0.0,
                                    'green' => 0.0,
                                    'blue' => 0.0
                                ]
                            ],
                            'horizontalAlignment' => 'CENTER'
                        ]
                    ],
                    'fields' => 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
                ]
            ]);
        }
        
        $batchUpdateRequest = new Sheets\BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);
        
        $this->service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);
    }
    
    public function appendOrder(){
        
    }
   
}
