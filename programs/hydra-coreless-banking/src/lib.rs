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
            amount: String::from("0"),
            currency: currency.clone(),
            journal_type: String::from("Create Account"),
            referrence_number: referrence_number,
            remark: remark,
        };
        let authority = &mut ctx.accounts.authority;
        let hydra_account = &mut ctx.accounts.hydra_account;
        hydra_account.pubkey = hydra_account.key();
        hydra_account.authority = authority.key();
        hydra_account.balance = String::from("0");
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
        amount: String,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let sender = &mut ctx.accounts.from_account;
        let amount_value = amount.parse::<f64>().unwrap();
        let sender_value = sender.balance.parse::<f64>().unwrap();

        if sender_value < amount_value {
            return Err(ErrorCode::InsufficientBalance.into());
        }
        let sender_journal_amount = -amount_value;
        let sender_journal = HydraJournal {
            amount: sender_journal_amount.to_string(),
            currency: sender.currency.clone(),
            journal_type: String::from("Transfer"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };

        let new_sender_balance = sender_value - amount_value;
        sender.balance = new_sender_balance.to_string();
        sender.transactions.push(sender_journal);

        let receiver = &mut ctx.accounts.to_account;
        let receiver_balance = receiver.balance.parse::<f64>().unwrap();
        let receiver_journal = HydraJournal {
            amount: amount_value.to_string(),
            currency: receiver.currency.clone(),
            journal_type: String::from("Transfer"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };

        let new_receiver_balance = receiver_balance + amount_value;
        receiver.balance = new_receiver_balance.to_string();
        receiver.transactions.push(receiver_journal);

        Ok(())
    }

    pub fn cross_currency_transfer(
        ctx: Context<Transfer>,
        amount: String,
        fxrate: String,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let sender = &mut ctx.accounts.from_account;
        let amount_value = amount.parse::<f64>().unwrap();
        let fxrate_value = fxrate.parse::<f64>().unwrap();
        let sender_value = sender.balance.parse::<f64>().unwrap();

        if sender_value < amount_value {
            return Err(ErrorCode::InsufficientBalance.into());
        }

        let sender_journal_amount = -amount_value;
        let sender_journal = HydraJournal {
            amount: sender_journal_amount.to_string(),
            currency: sender.currency.clone(),
            journal_type: String::from("Transfer"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };
        let new_sender_balance = sender_value - amount_value;
        sender.balance = new_sender_balance.to_string();
        sender.transactions.push(sender_journal);

        //let amount_decimal = Decimal::from_u64(amount).unwrap();
        //let fxrate_decimal = Decimal::from_u64(fxrate).unwrap();
        //let receiver_amount = (amount_decimal * fxrate_decimal)
        //.round_dp(4)
        //.to_u64()
        //.unwrap();
        let receiver_amount = amount_value * fxrate_value;
        let receiver = &mut ctx.accounts.to_account;
        let receiver_balance = receiver.balance.parse::<f64>().unwrap();
        let receiver_journal = HydraJournal {
            amount: receiver_amount.to_string(),
            currency: receiver.currency.clone(),
            journal_type: String::from("Transfer"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };

        let new_receiver_balance = receiver_balance + receiver_amount;
        receiver.balance = new_receiver_balance.to_string();
        receiver.transactions.push(receiver_journal);

        Ok(())
    }
    pub fn topup(
        ctx: Context<TopUpAccount>,
        amount: String,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let hydra_account = &mut ctx.accounts.hydra_account;
        let amount_value = amount.parse::<f64>().unwrap();
        let new_balance = hydra_account.balance.parse::<f64>().unwrap() + amount_value;

        hydra_account.balance = new_balance.to_string();

        let journal = HydraJournal {
            amount: amount_value.to_string(),
            currency: hydra_account.currency.clone(),
            journal_type: String::from("Account Top Up"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };
        hydra_account.transactions.push(journal);

        Ok(())
    }

    pub fn withdraw(
        ctx: Context<AccountWithdraw>,
        amount: String,
        remark: String,
        referrence_number: String,
    ) -> ProgramResult {
        let hydra_account = &mut ctx.accounts.hydra_account;
        let amount_value = amount.parse::<f64>().unwrap();
        let current_value = hydra_account.balance.parse::<f64>().unwrap();
        if current_value < amount_value {
            return Err(ErrorCode::InsufficientBalance.into());
        }
        let new_balance = current_value - amount_value;
        let sender_journal_amount = -amount_value;
        let sender_journal = HydraJournal {
            amount: sender_journal_amount.to_string(),
            currency: hydra_account.currency.clone(),
            journal_type: String::from("Account Withdraw"),
            referrence_number: referrence_number.clone(),
            remark: remark.clone(),
        };

        hydra_account.balance = new_balance.to_string();
        hydra_account.transactions.push(sender_journal);

        Ok(())
    }
}
