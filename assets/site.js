const TOKEN_CONTRACT_ADDRESS = ''; // 填入 MarsX / SPCXB BEP-20 合约地址后，可读取连接钱包的代币余额
    const TOKEN_DECIMALS = 18;
    const TOKEN_SYMBOL = 'MX';
    const BSC_MAINNET = { chainId: '0x38', chainName: 'BNB Smart Chain', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, rpcUrls: ['https://bsc-dataseed.binance.org/'], blockExplorerUrls: ['https://bscscan.com'] };
    const ERC20_ABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}];
    function setLang(lang){document.body.classList.toggle('lang-en',lang==='en');document.documentElement.lang=lang==='en'?'en':'zh-CN';document.getElementById('zhBtn').classList.toggle('active',lang==='zh');document.getElementById('enBtn').classList.toggle('active',lang==='en');localStorage.setItem('marsx-lang',lang)}
    function shortAddr(addr){return addr.slice(0,6)+'...'+addr.slice(-4)}
    async function connectWallet(){
      const status=document.getElementById('walletStatus');const balance=document.getElementById('tokenBalance');
      if(!status || !balance){window.location.href='passport.html';return}
      if(!window.ethereum){status.textContent='请安装 MetaMask / OKX / Rabby 等 EVM 钱包';return}
      try{
        const chainId=await ethereum.request({method:'eth_chainId'});
        if(chainId!=='0x38'){
          try{await ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x38'}]})}
          catch(e){if(e.code===4902){await ethereum.request({method:'wallet_addEthereumChain',params:[BSC_MAINNET]})}else{throw e}}
        }
        const accounts=await ethereum.request({method:'eth_requestAccounts'});const account=accounts[0];status.textContent='已连接 BSC：'+shortAddr(account);
        if(!TOKEN_CONTRACT_ADDRESS){balance.textContent='Token Balance: 等待填入代币合约地址';return}
        const data='0x70a08231000000000000000000000000'+account.slice(2).toLowerCase();
        const raw=await ethereum.request({method:'eth_call',params:[{to:TOKEN_CONTRACT_ADDRESS,data},'latest']});
        const value=BigInt(raw);const divisor=10n**BigInt(TOKEN_DECIMALS);const whole=value/divisor;const fraction=(value%divisor).toString().padStart(TOKEN_DECIMALS,'0').slice(0,4);
        balance.textContent='Token Balance: '+whole.toLocaleString()+'.'+fraction+' '+TOKEN_SYMBOL;
      }catch(err){status.textContent='连接失败：'+(err && err.message ? err.message : '请重试')}
    }
    setLang(localStorage.getItem('marsx-lang')||'zh')
