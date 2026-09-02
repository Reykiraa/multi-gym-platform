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
        }
        .content p {
            margin: 0 0 15px 0;
            color: #ffffff;
        }
        .btn-container {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            background-color: #eab308;
            color: #09090b;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
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
            <h1>GYMNOX</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{ $user->name }}</strong>,</p>
            <p>Selamat bergabung di ROAMFIT! Kami sangat senang melihatmu memulai perjalanan fitness bersama kami.</p>
            <p>Dengan ROAMFIT, kamu sekarang bisa mengakses berbagai gym di satu platform dengan mudah. Mulai jelajahi gym di sekitarmu, lakukan top-up kredit, dan mulai latihanmu hari ini!</p>
            
            <div class="btn-container">
                <a href="{{ config('app.frontend_url', config('app.url')) }}" class="btn">Mulai Jelajahi</a>
            </div>
            
            <p>Jika ada pertanyaan, jangan ragu untuk menghubungi tim support kami.</p>
            <p>Salam hangat,<br>Tim ROAMFIT</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} ROAMFIT. All rights reserved.
        </div>
    </div>
</body>
</html>
