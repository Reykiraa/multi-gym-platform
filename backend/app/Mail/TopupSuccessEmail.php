<?php

namespace App\Mail;

use App\Models\User;
use App\Models\TopupTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TopupSuccessEmail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public TopupTransaction $transaction;

    public function __construct(User $user, TopupTransaction $transaction)
    {
        $this->user = $user;
        $this->transaction = $transaction;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Bukti Pembayaran: Top-Up {$this->transaction->total_credits} Credits Berhasil [#{$this->transaction->order_id}]",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.topup_receipt',
        );
    }
}
