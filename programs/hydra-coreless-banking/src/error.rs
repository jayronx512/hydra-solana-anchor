use anchor_lang::prelude::*;

#[error]
pub enum ErrorCode {
    #[msg("Unable to complete transaction due to insufficient balance.")]
    InsufficientBalance,
}
