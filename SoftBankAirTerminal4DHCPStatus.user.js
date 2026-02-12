// ==UserScript==
// @name         SoftBank Air Terminal 4 DHCP Status
// @version      1.0.1
// @description  SoftBank Air ターミナル4の管理画面に、DHCPサーバの有効／無効設定を追加します
// @author       masamasa1029
// @grant        none
// @run-at       document-idle
// @updateURL    https://masamasa1029.github.io/SoftBankAirDHCP/SoftBankAirTerminal4DHCPStatus.user.js
// @downloadURL  https://masamasa1029.github.io/SoftBankAirDHCP/SoftBankAirTerminal4DHCPStatus.user.js
// @include      /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}\/html\/ipadress.html/
// @include      /^https?:\/\/172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\/html\/ipadress.html/
// @include      /^https?:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}\/html\/ipadress.html/
// ==/UserScript==

(function () {
    'use strict';

    const main = document.querySelector('.mainContent');
    const form = document.querySelector('form[action="IPDHCPCGI"]');
    const dhcpData = window.DhcpHostipRangeipData;

    if (!main || !form || !dhcpData) {
        // 必須項目がない場合は終了
        return;
    }

    // ラジオボタン作成
    main.insertAdjacentHTML('afterbegin',
        `<dl class="blue">
    <dt>
        <span class="txt18 bold">DHCPサーバの有効／無効設定</span>
    </dt>
    <dd>
        <div class="bgcGray otherImg">
            <input type="radio" name="dhcpstatus" value="1" id="ds01">
            <label for="ds01">有効</label>
            <input type="radio" name="dhcpstatus" value="0" id="ds02">
            <label for="ds02">無効</label>
        </div>
    </dd>
</dl>`);

    // 作成したラジオボタン取得
    const dhcpRadio = form.dhcpstatus;

    // DhcpStatusをラジオボタンに反映
    dhcpRadio.value = String(dhcpData.dhcp_value().DhcpStatus);

    // 元のsubmit処理を保持
    const origsubmit = dhcpData.submit;

    // submit処理をフック(上書き)
    dhcpData.submit = function (...args) {

        // ラジオボタンの設定値をDhcpStatusに設定
        dhcpData.dhcp_value().DhcpStatus = parseInt(dhcpRadio.value, 10);

        // 元のsubmit処理を実行
        return origsubmit.apply(this, args);
    };
})();
