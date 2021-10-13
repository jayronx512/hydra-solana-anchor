use account::*;
use anchor_lang::prelude::*;
use context::*;
use error::*;
use rust_decimal::prelude::*;

mod account;
mod context;
mod error;

declare_id!("2WGPmHfmXLfUjL1wEpmUGGHA8LRwbPbYEbMwmUQ6Z186");

#[program]
mod hydra_coreless_banking {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>, amount: String, fx_rate: String) -> ProgramResult {
        msg!("initialize");

        //let amount_value: f64 = amount.parse().unwrap();
        //let fx_rate_value: f64 = fx_rate.parse().unwrap();
        //let receiver_amount = amount_value * fx_rate_value;
        //format!("{0:.1$}", receiver_amount, 4);
        //msg!(&receiver_amount.to_string());
        let amount_value = Decimal::from_str(&amount).unwrap();
        let fx_rate_value = Decimal::from_str(&fx_rate).unwrap();
        let receiver_amount = amount_value * fx_rate_value;
        let receiver_amount2 = (amount_value * fx_rate_value).round_dp(4);

        msg!(&receiver_amount.to_string());
        msg!(&receiver_amount2.to_string());

        let hydra_account = &mut _ctx.accounts.hydra_account;
        msg!(&hydra_account.pubkey.to_string());
        msg!(&hydra_account.pubkey.to_string());
        Ok(())
    }
    pub fn create_account(
        ctx: Context<CreateAccount>,
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
        let authority = &mut ctx.accounts.authority;
        let hydra_account = &mut ctx.accounts.hydra_account;
        hydra_account.pubkey = hydra_account.key();
        hydra_account.authority = authority.key();
        hydra_account.balance = 0;
        hydra_account.currency = currency;
        hydra_account.client_name = name;
        hydra_account.client_identification_number = id_number;
        hydra_account.client_identification_type = id_type;
        hydra_account.client_email = email;
        hydra_account.transactions.push(journal);
        Ok(())
    }

    pub fn transfer(
        ctx: Context<Transfer>,
        amount: u64,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let sender = &mut ctx.accounts.from_account;
        if sender.balance < amount {
            return Err(ErrorCode::InsufficientBalance.into());
        }

        let sender_journal = HydraJournal {
            amount: 0 - amount as i64,
            currency: sender.currency.clone(),
            journal_type: String::from("3rd_party_transfer"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };

        sender.balance -= amount;
        sender.transactions.push(sender_journal);

        let receiver = &mut ctx.accounts.to_account;
        let receiver_journal = HydraJournal {
            amount: amount as i64,
            currency: receiver.currency.clone(),
            journal_type: String::from("transfer"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };
        receiver.balance += amount;
        receiver.transactions.push(receiver_journal);

        Ok(())
    }

    pub fn topup(
        ctx: Context<TopUpAccount>,
        amount: u64,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let hydra_account = &mut ctx.accounts.hydra_account;
        hydra_account.balance += amount;

        let journal = HydraJournal {
            amount: amount as i64,
            currency: hydra_account.currency.clone(),
            journal_type: String::from("account_topup"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };
        hydra_account.transactions.push(journal);

        Ok(())
    }

    pub fn withdraw(
        ctx: Context<AccountWithdraw>,
        amount: u64,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let hydra_account = &mut ctx.accounts.hydra_account;
        if hydra_account.balance < amount {
            return Err(ErrorCode::InsufficientBalance.into());
        }

        let sender_journal = HydraJournal {
            amount: 0 - amount as i64,
            currency: hydra_account.currency.clone(),
            journal_type: String::from("account_withdraw"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };

        hydra_account.balance -= amount;
        hydra_account.transactions.push(sender_journal);

        Ok(())
    }
}
