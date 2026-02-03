<?php

namespace App\Services\Google;

use App\Http\Controllers\SheetsController;
use App\Models\GoogleSheet;
use App\Models\Order;
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
        $this->syncFirstTimeDataToSheet($spreadSheetId , $sheetName);
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

    
    public function syncFirstTimeDataToSheet($spreadsheetId, $sheetName){
        $this->writeOrderData($spreadsheetId, $sheetName);
        // styling sheet requests
        $requests = [] ;
        // get sheet id fo rmaking requests 
        $spreadsheet = $this->service->spreadsheets->get($spreadsheetId);
        $sheetId = $spreadsheet->getSheets()[0]->getProperties()->sheetId;
        $requests = array_merge($requests, $this->headerFormattingRequests($sheetId));
        $requests = array_merge($requests, $this->stylingSheetRequests($sheetId));
        
        $batchUpdateRequest = new Sheets\BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);
        
        $this->service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);

    }
    
    public function appendOrder(){
    
    }

    private function stylingSheetRequests($sheetId){
        
        /* ============================================
         cell resize deonds on content 
        =============================================== */
        $requests[] = new Sheets\Request([
            'autoResizeDimensions' => [
                'dimensions' => [
                    'sheetId' => $sheetId,
                    'dimension' => 'COLUMNS',    // Resize columns (not rows)
                    'startIndex' => 0,           // Column A (0-indexed)
                    'endIndex' => 11             // Through column K (11 columns total)
                ]
            ]
        ]);
         /* ============================================
                     drop down creation
        =============================================== */
        $requests[] = new Sheets\Request([ 'setDataValidation' => [
            'range' => [
                'sheetId' => $sheetId,
                'startRowIndex' => 1,        // Start from row 2 (after header)
                'endRowIndex' => 1000,       // Apply to first 1000 rows
                'startColumnIndex' => 9,     // Column J (Status column, 0-indexed)
                'endColumnIndex' => 10       // Only column J
            ],
            'rule' => [
                'condition' => [
                    'type' => 'ONE_OF_LIST',
                    'values' => [
                        ['userEnteredValue' => 'pending'],
                        ['userEnteredValue' => 'out_for_delivery'],
                        ['userEnteredValue' => 'delivered'],
                        ['userEnteredValue' => 'delivery_failed'],
                        ['userEnteredValue' => 'returned'],
                    ]
                ],
                'showCustomUi' => true,      // Show dropdown arrow
                'strict' => true             // Only allow values from list
            ]
        ]]) ;
        // Green background for "delivered"
        $requests[] = new Sheets\Request([
            'addConditionalFormatRule' => [
                'rule' => [
                    'ranges' => [[
                        'sheetId' => $sheetId,
                        'startRowIndex' => 1,        // Start from row 2 (after header)
                        'endRowIndex' => 1000,       // Apply to first 1000 rows
                        'startColumnIndex' => 9,     // Column J (Status column, 0-indexed)
                        'endColumnIndex' => 10       // Only column J
                    ]],
                    'booleanRule' => [
                        'condition' => [
                            'type' => 'TEXT_EQ',     // Text equals
                            'values' => [[
                                'userEnteredValue' => 'delivered'
                            ]]
                        ],
                        'format' => [
                            'backgroundColor' => [
                                'red' => 0.7,
                                'green' => 1.0,
                                'blue' => 0.7
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        // Red background for "canceled"
        $requests[] = new Sheets\Request([
            'addConditionalFormatRule' => [
                'rule' => [
                    'ranges' => [[
                        'sheetId' => $sheetId,
                        'startRowIndex' => 1,
                        'endRowIndex' => 1000,
                        'startColumnIndex' => 9,
                        'endColumnIndex' => 10
                    ]],
                    'booleanRule' => [
                        'condition' => [
                            'type' => 'TEXT_EQ',
                            'values' => [[
                                'userEnteredValue' => 'canceled'
                            ]]
                        ],
                        'format' => [
                            'backgroundColor' => [
                                'red' => 1.0,
                                'green' => 0.7,
                                'blue' => 0.7
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        // Yellow background for "pending"
        $requests[] = new Sheets\Request([
            'addConditionalFormatRule' => [
                'rule' => [
                    'ranges' => [[
                        'sheetId' => $sheetId,
                        'startRowIndex' => 1,
                        'endRowIndex' => 1000,
                        'startColumnIndex' => 9,
                        'endColumnIndex' => 10
                    ]],
                    'booleanRule' => [
                        'condition' => [
                            'type' => 'TEXT_EQ',
                            'values' => [[
                                'userEnteredValue' => 'pending'
                            ]]
                        ],
                        'format' => [
                            'backgroundColor' => [
                                'red' => 1.0,
                                'green' => 1.0,
                                'blue' => 0.7
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        // Orange background for "confirmed"
        $requests[] = new Sheets\Request([
            'addConditionalFormatRule' => [
                'rule' => [
                    'ranges' => [[
                        'sheetId' => $sheetId,
                        'startRowIndex' => 1,
                        'endRowIndex' => 1000,
                        'startColumnIndex' => 9,
                        'endColumnIndex' => 10
                    ]],
                    'booleanRule' => [
                        'condition' => [
                            'type' => 'TEXT_EQ',
                            'values' => [[
                                'userEnteredValue' => 'confirmed'
                            ]]
                        ],
                        'format' => [
                            'backgroundColor' => [
                                'red' => 1.0,
                                'green' => 0.9,
                                'blue' => 0.7
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        // Light blue background for "out_for_delivery"
        $requests[] = new Sheets\Request([
            'addConditionalFormatRule' => [
                'rule' => [
                    'ranges' => [[
                        'sheetId' => $sheetId,
                        'startRowIndex' => 1,
                        'endRowIndex' => 1000,
                        'startColumnIndex' => 9,
                        'endColumnIndex' => 10
                    ]],
                    'booleanRule' => [
                        'condition' => [
                            'type' => 'TEXT_EQ',
                            'values' => [[
                                'userEnteredValue' => 'out_for_delivery'
                            ]]
                        ],
                        'format' => [
                            'backgroundColor' => [
                                'red' => 0.7,
                                'green' => 0.9,
                                'blue' => 1.0
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        // Light purple background for "returned"
        $requests[] = new Sheets\Request([
            'addConditionalFormatRule' => [
                'rule' => [
                    'ranges' => [[
                        'sheetId' => $sheetId,
                        'startRowIndex' => 1,
                        'endRowIndex' => 1000,
                        'startColumnIndex' => 9,
                        'endColumnIndex' => 10
                    ]],
                    'booleanRule' => [
                        'condition' => [
                            'type' => 'TEXT_EQ',
                            'values' => [[
                                'userEnteredValue' => 'returned'
                            ]]
                        ],
                        'format' => [
                            'backgroundColor' => [
                                'red' => 0.9,
                                'green' => 0.8,
                                'blue' => 1.0
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        // Dark red background for "delivery_failed"
        $requests[] = new Sheets\Request([
            'addConditionalFormatRule' => [
                'rule' => [
                    'ranges' => [[
                        'sheetId' => $sheetId,
                        'startRowIndex' => 1,
                        'endRowIndex' => 1000,
                        'startColumnIndex' => 9,
                        'endColumnIndex' => 10
                    ]],
                    'booleanRule' => [
                        'condition' => [
                            'type' => 'TEXT_EQ',
                            'values' => [[
                                'userEnteredValue' => 'delivery_failed'
                            ]]
                        ],
                        'format' => [
                            'backgroundColor' => [
                                'red' => 1.0,
                                'green' => 0.6,
                                'blue' => 0.6
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        return $requests ;

    }
   
    private function writeOrderData($spreadsheetId, $sheetName)
    {
        $orders = Order::with(['user', 'address'])
        ->whereNotIn('status', ['canceled', 'delivered'])
        ->orderBy('updated_at')
        ->get();
        
        $header = [
            ['Order ID', 'Customer Name', 'Phone Number' , 'E-mail', 'City' , 'Postal Code' , 'Address 1' , 'Address 2' ,  'Total Price' , 'Status' , 'Date' , 'notes']
        ];

        $rows = $header ;
        foreach($orders as $order){
            $rows[] = [
                    '#' . $order->order_number ?? '',
                    $order->address->full_name ?? '',
                    $order->address->phone ?? '-',
                    $order->address->email ?? '-',
                    $order->address->city ?? '-',
                    $order->address->postal_code ?? '-',
                    $order->address->address_line1 ?? '-',
                    $order->address->address_line2 ?? '',
                    number_format($order->total_amount, 2) ,
                    $order->status,
                    $order->updated_at->format('M d, Y g:i A') ,
                    $order->notes ,
            ] ;
        }

        $body = new Sheets\ValueRange(['values' => $rows]);
        
        $this->service->spreadsheets_values->update(
            $spreadsheetId,
            "{$sheetName}!A1",
            $body,
            ['valueInputOption' => 'RAW']
        );
        

    }

    private function headerFormattingRequests($sheetId)
    {
          // Define colors for each column
        $columnColors = [
            // Column A: Order ID - Light Blue
            ['red' => 0.7, 'green' => 0.85, 'blue' => 1.0],

            // Column B: Customer Name - Light Green
            ['red' => 0.7, 'green' => 1.0, 'blue' => 0.8],

            // Column C: Phone Number - Soft Lime
            ['red' => 0.85, 'green' => 1.0, 'blue' => 0.7],

            // Column D: E-mail - Light Yellow
            ['red' => 1.0, 'green' => 0.95, 'blue' => 0.7],

            // Column E: City - Light Cyan
            ['red' => 0.7, 'green' => 0.9, 'blue' => 1.0],

            // Column F: Postal Code - Soft Sky Blue
            ['red' => 0.7, 'green' => 0.85, 'blue' => 1.0],

            // Column G: Address 1 - Light Purple
            ['red' => 0.85, 'green' => 0.8, 'blue' => 1.0],

            // Column H: Address 2 - Slightly Darker Purple
            ['red' => 0.8, 'green' => 0.7, 'blue' => 1.0],

            // Column I: Total Price - Light Orange
            ['red' => 1.0, 'green' => 0.85, 'blue' => 0.7],

            // Column J: Status - Light Pink
            ['red' => 1.0, 'green' => 0.8, 'blue' => 0.9],

            // Column K: Date - Light Gray
            ['red' => 0.9, 'green' => 0.9, 'blue' => 0.95],
        ];
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
                ] , 
                
            ]);
        }
        return $requests;
    }

}
