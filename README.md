Infinitude - Coreless solution
===

Coreless solution to improve efficiencies at lesser cost with DLT as primary ledger.

**Technology stack**:
* Rust
* Anchor Framework
* Nodejs
* Reactjs
* MongoDB

## Prerequisites
* **Rust**

See the Rust [book](https://doc.rust-lang.org/book) for an introduction.

Install Rust.
```shen
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup component add rustfmt
```

Verify installed cargo version.
```shen
cargo --version
```

* **Solana Tool Suite**

See the solana [docs](https://docs.solana.com/cli/install-solana-cli-tools) for more details on the installation instructions.

Install Solana CLI on macOS and Linux.
```shen
sh -c "$(curl -sSfL https://release.solana.com/v1.7.13/install)"
```

Verify installed solana version.
```shen
solana --version
```
* **Anchor**

See the [getting started doc](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor) for more information.

Install Mocha for program integration tests.
```shen
npm install -g mocha
```

Build Anchor from source.
```shen
cargo install --git https://github.com/project-serum/anchor --tag v0.17.0 anchor-cli --locked
```

Install the JavaScript package.
```shen
npm install -g @project-serum/anchor
```

Verify installed anchor CLI version.
```shen
anchor --version
```

* **Node**

See the [Node.js Downloads page](https://nodejs.org/en/download/) to install _node_ and _npm_.

* **MongoDB**

See the [MongoDB installation manual](https://docs.mongodb.com/manual/installation/) for installation instructions.

## Build and deploy the program

Connect solana to Devnet.
```shen
solana config set --url devnet
```

Verify the configurations.
```shen
solana config get
```

Output.
```yaml
Config File: /Users/user/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com 
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/user/.config/solana/id.json 
Commitment: confirmed 
```

If you do not have a `Keypair Path`, see following the [instructions](https://docs.solana.com/wallet-guide/paper-wallet#seed-phrase-generation) to generate one.

Verify the genereted pubkey.
```shen
solana-keygen pubkey
```

Or get details of an account.
```shen
solana account <pubkey>
```

Airdrop SOL to the Devnet cluster in order to deploy the program.
```shen
solana airdop 1
```

Verify the balance.
```shen
solana balance
```
Open terminal and locate to the root source folder.

Build the program
```shen
anchor build
```

Deploy
```shen
anchor deploy
```

Test the program
```shen
anchor test
```
Optional: add the `--skip-deploy` flag to skip the deployment process if there is no change in the program.

## Build and run the backend

Open terminal and locate to **app** folder in the root source folder.

Install the dependencies.
```shen
npm install
```

Run the backend.
```shen
npm start
```

Output.
```gn
> app@1.0.0 start
> ./node_modules/nodemon/bin/nodemon.js

[nodemon] 2.0.13
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node app.ts`
Service started at port 5000
```

## Build and run the react client

Open terminal and locate to **client/reactjs** folder.

Install the dependencies.
```shen
npm install
```

Run the client.
```shen
npm start
```

Screenshot
-----

Developed By
------------
Infinitude team.
