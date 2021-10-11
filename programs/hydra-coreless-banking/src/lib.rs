use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

declare_id!("2WGPmHfmXLfUjL1wEpmUGGHA8LRwbPbYEbMwmUQ6Z186");

#[program]
mod hydra_coreless_banking {
    use super::*;

    pub fn create_account(
        ctx: Context<Create>,
        currency: String,
        name: String,
        id_number: String,
        id_type: String,
        email: String,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let journal = HydraJournal {
            amount: 0,
            currency: currency.clone(),
            journal_type: String::from("create_account"),
            referrence_number: referrence_number,
            remark: remark,
        };
        let hydra_account = &mut ctx.accounts.hydra_account;
        hydra_account.pubkey = hydra_account.key();
        hydra_account.balance = 0;
        hydra_account.currency = currency;
        hydra_account.client_name = name;
        hydra_account.client_identification_number = id_number;
        hydra_account.client_identification_type = id_type;
        hydra_account.client_email = email;
        hydra_account.transactions.push(journal);
        Ok(())
    }

    pub fn reset(ctx: Context<Reset>) -> ProgramResult {
        let sender = &mut ctx.accounts.from_account;
        sender.balance = 1000;
        sender.transactions.clear();

        let receiver = &mut ctx.accounts.to_account;
        receiver.balance = 0;
        receiver.transactions.clear();

        Ok(())
    }

    pub fn transfer(
        ctx: Context<Transfer>,
        amount: u64,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        //TODO: check sufficient balance before subtract
        //TODO: authenticate all instructions
        let sender = &mut ctx.accounts.from_account;
        sender.balance -= amount;

        let sender_journal = HydraJournal {
            amount: 0 - amount as i64,
            currency: sender.currency.clone(),
            journal_type: String::from("fund_transfer"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };
        sender.transactions.push(sender_journal);

        let receiver = &mut ctx.accounts.to_account;
        receiver.balance += amount;

        let receiver_journal = HydraJournal {
            amount: amount as i64,
            currency: receiver.currency.clone(),
            journal_type: String::from("fund_transfer"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };
        receiver.transactions.push(receiver_journal);

        Ok(())
    }

    pub fn debit(
        ctx: Context<Debit>,
        amount: u64,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let hydra_account = &mut ctx.accounts.hydra_account;
        hydra_account.balance += amount;

        let journal = HydraJournal {
            amount: amount as i64,
            currency: hydra_account.currency.clone(),
            journal_type: String::from("debit"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };
        hydra_account.transactions.push(journal);

        Ok(())
    }

    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let hydra_account = &mut ctx.accounts.hydra_account;
        hydra_account.balance -= amount;

        let sender_journal = HydraJournal {
            amount: 0 - amount as i64,
            currency: hydra_account.currency.clone(),
            journal_type: String::from("withdraw"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };
        hydra_account.transactions.push(sender_journal);

        Ok(())
    }
}

// Transaction instructions for Create Account
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 1000)]
    pub hydra_account: Account<'info, HydraAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Transaction instructions for Fund Transfer
#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from_account: Account<'info, HydraAccount>,

    #[account(mut)]
    pub to_account: Account<'info, HydraAccount>,
}

// Transaction instructions for Debit Account
#[derive(Accounts)]
pub struct Debit<'info> {
    #[account(mut)]
    pub hydra_account: Account<'info, HydraAccount>,
}

// Transaction instructions for Withdraw
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub hydra_account: Account<'info, HydraAccount>,
}

// Transaction instructions for Fund Transfer
#[derive(Accounts)]
pub struct Reset<'info> {
    #[account(mut)]
    pub from_account: Account<'info, HydraAccount>,

    #[account(mut)]
    pub to_account: Account<'info, HydraAccount>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct HydraAccount {
    pub pubkey: Pubkey,
    pub balance: u64,
    pub currency: String,
    pub client_name: String,
    pub client_identification_number: String,
    pub client_identification_type: String,
    pub client_email: String,
    pub transactions: Vec<HydraJournal>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct HydraJournal {
    pub amount: i64,
    pub currency: String,
    pub journal_type: String,
    pub referrence_number: String,
    pub remark: String,
}
