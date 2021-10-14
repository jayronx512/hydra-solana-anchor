use anchor_lang::prelude::*;

// An account that goes inside a transaction instruction
#[account]
pub struct HydraAccount {
    pub pubkey: Pubkey,
    pub authority: Pubkey,
    pub balance: String,
    pub currency: String,
    pub client_name: String,
    pub client_identification_number: String,
    pub client_identification_type: String,
    pub client_email: String,
    pub transactions: Vec<HydraJournal>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct HydraJournal {
    pub amount: String,
    pub currency: String,
    pub journal_type: String,
    pub referrence_number: String,
    pub remark: String,
}
