use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

declare_id!("G17Xqi5vxArztd7w1ScgYF1YcYCqf5wcLFDRLd9hQ7Lh");

#[program]
mod hydra_solana_anchor {
    use super::*;

    pub fn create_account(
        ctx: Context<Create>,
        currency: String,
        name: String,
        id_number: String,
        id_type: String,
        email: String,
        remark: String,
    ) -> ProgramResult {
        // let hydra_journal = &mut ctx.accounts.hydra_journal;
        // hydra_journal.amount = 0;
        // hydra_journal.currency = currency;
        // hydra_journal.journal_type = String::from("account_creation");
        // hydra_journal.referrence_number = String::from("REF000000001");
        // hydra_journal.remark = remark;

        let ccy = currency.clone();

        let journal = HydraJournal {
            amount: String::from("0"),
            currency: currency,
            journal_type: String::from("account_creation"),
            referrence_number: String::from("REF000000001"),
            remark: remark,
        };

        let hydra_account = &mut ctx.accounts.hydra_account;
        hydra_account.balance = String::from("0");
        hydra_account.currency = ccy;
        hydra_account.client_name = name;
        hydra_account.client_identification_number = id_number;
        hydra_account.client_identification_type = id_type;
        hydra_account.client_email = email;
        hydra_account.transactions.push(journal);
        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 128 + 128)]
    pub hydra_account: Account<'info, HydraAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct HydraAccount {
    pub pubkey: Pubkey,
    pub balance: String,
    pub currency: String,
    pub client_name: String,
    pub client_identification_number: String,
    pub client_identification_type: String,
    pub client_email: String,
    pub transactions: Vec<HydraJournal>,
}

//#[account]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub struct HydraJournal {
    pub amount: String,
    pub currency: String,
    pub journal_type: String, //"deposit / withdraw"
    pub referrence_number: String,
    pub remark: String,
    //pub transaction_type: u32,
    //pub account: HydraAccount,
}
