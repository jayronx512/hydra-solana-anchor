Infinitude - Coreless Solution
===
Technology stack:
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


## Build and deploy the program

Connect solana to Devnet.
```shen
solana config set --url devnet
```

Verify the configurations.
```shen
solana config get
```

Build the program
```shen
anchor build
```

Deploy
```shen
anchor deploy
```

## Build and run the backend

Open terminal and locate to **app** folder.

Install the dependencies.
```shen
npm install
```

Run the backend.
```shen
npm start
```

## Build and run the web

Open terminal and locate to **client/reactjs** folder.

Install the dependencies.
```shen
npm install
```

Run the web.
```shen
npm start
```

Screenshot
-----

Developed By
------------
Infinitude team.
