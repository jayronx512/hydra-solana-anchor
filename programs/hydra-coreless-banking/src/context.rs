use crate::account::*;
use anchor_lang::prelude::*;

// Transaction instructions for Create Account
#[derive(Accounts)]
pub struct CreateAccount<'info> {
    #[account(init, payer = authority, space = 10000)]
    pub hydra_account: Account<'info, HydraAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Transaction instructions for Debit Account
#[derive(Accounts)]
pub struct TopUpAccount<'info> {
    #[account(mut)]
    pub hydra_account: Account<'info, HydraAccount>,
}

// Transaction instructions for Withdraw
#[derive(Accounts)]
pub struct AccountWithdraw<'info> {
    #[account(mut, has_one = authority, signer)]
    pub hydra_account: Account<'info, HydraAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

// Transaction instructions for Fund Transfer
#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut, has_one = authority, signer)]
    pub from_account: Account<'info, HydraAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub to_account: Account<'info, HydraAccount>,
}
