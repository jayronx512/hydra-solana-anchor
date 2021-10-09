use anchor_lang::prelude::*;

declare_id!("G17Xqi5vxArztd7w1ScgYF1YcYCqf5wcLFDRLd9hQ7Lh");

#[program]
mod hydra_solana_anchor {
    use super::*;

    pub fn create_account(
        ctx: Context<Create>,
        currency: u32,
        name: String,
        id_number: String,
        id_type: String,
        email: String,
    ) -> ProgramResult {
        let sc_account = &mut ctx.accounts.sc_account;
        sc_account.balance = 0;
        sc_account.currency = currency;
        sc_account.client_name = name;
        sc_account.client_identification_number = id_number;
        sc_account.client_identification_type = id_type;
        sc_account.client_email = email;
        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 64 + 64)]
    pub sc_account: Account<'info, SCAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct SCAccount {
    pub pubkey: Pubkey,
    pub balance: u128,
    pub currency: u32,
    pub client_name: String,
    pub client_identification_number: String,
    pub client_identification_type: String,
    pub client_email: String,
}
