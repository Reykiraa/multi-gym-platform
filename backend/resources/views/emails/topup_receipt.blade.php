<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #09090b;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #18181b;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #3f3f46;
        }
        .header h1 {
            color: #eab308;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
            line-height: 1.6;
            color: #ffffff;
        }
        .receipt-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #27272a;
            border-radius: 8px;
            overflow: hidden;
        }
        .receipt-table th, .receipt-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #3f3f46;
        }
        .receipt-table th {
            color: #a1a1aa;
            font-weight: normal;
            width: 40%;
        }
        .receipt-table tr:last-child th, .receipt-table tr:last-child td {
            border-bottom: none;
        }
        .highlight {
            color: #eab308;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #a1a1aa;
            border-top: 1px solid #3f3f46;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BUKTI PEMBAYARAN</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{ $user->name }}</strong>,</p>
            <p>Terima kasih! Pembayaran top-up saldo ROAMFIT kamu telah berhasil kami terima.</p>
            
            <table class="receipt-table">
                <tr>
                    <th>Order ID</th>
                    <td>{{ $transaction->order_id }}</td>
                </tr>
                <tr>
                    <th>Tanggal & Waktu</th>
                    <td>{{ $transaction->updated_at->format('d M Y, H:i') }}</td>
                </tr>
                <tr>
                    <th>Nominal Pembayaran</th>
                    <td>Rp {{ number_format($transaction->amount_idr, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <th>Kredit Masuk</th>
                    <td class="highlight">+{{ $transaction->total_credits }} CR</td>
                </tr>
                <tr>
                    <th>Total Saldo Terkini</th>
                    <td class="highlight">{{ $user->credit_balance }} CR</td>
                </tr>
            </table>
            
            <p>Saldo kredit sudah otomatis masuk ke akunmu dan siap digunakan untuk check-in di gym pilihanmu.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} ROAMFIT. All rights reserved.
        </div>
    </div>
</body>
</html>
