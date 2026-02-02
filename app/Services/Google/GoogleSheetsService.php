<?php

namespace App\Services\Google;

use App\Http\Controllers\SheetsController;
use App\Models\GoogleSheet;
use Exception;
use Google\Client;
use Google\Service\Sheets;
use Google_Client;
use Google_Service_Drive;
use Illuminate\Support\Facades\Log;

class GoogleSheetsService
{
    protected $service ;
    protected $client ;
    public function __construct() {
        $this->client = app('googleApp') ;
        $this->service = new Sheets($this->client);
    }

    private function createOrderSheet($sheetName , $accessToken){
        if ($accessToken) {
            $this->client->setAccessToken($accessToken);
        }else{
            Log::emergency('access token ' , 'acces token for creating sheets is missing or null');
        }

        $this->client->setScopes([Sheets::SPREADSHEETS]);
        $sheet = new Sheets\Spreadsheet([
            'properties' => [
                    'title' => $sheetName
            ],
           'sheets' => [
            [
                'properties' => [
                    'title' => $sheetName
                ]
            ]
        ]
        ]) ;

        $createdSheet = $this->service->spreadsheets->create($sheet);
        
        $spreadSheetId = $createdSheet->spreadsheetId ;
        $this->setupHeaders($spreadSheetId);
        $this->syncFirstTimeDataToSheet() ;
        return $createdSheet;
    }

    public function getOrCreateOrderSheet($sheetName= 'orders' , $accessToken = null){
        $sheet = GoogleSheet::where('key' , $sheetName)->first() ;
        if(!$sheet){
            $createdSheet = $this->createOrderSheet($sheetName, $accessToken);
            return GoogleSheet::create([
                'key' => $sheetName ,
                'spreadsheet_id' => $createdSheet->spreadsheetId ,
                'spreadsheet_url' =>  $createdSheet->spreadsheetUrl ,
            ]);
        }
        return $sheet;
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
    
    public function syncFirstTimeDataToSheet(){

    }
    
    public function appendOrder(){
    
    }
   
}
