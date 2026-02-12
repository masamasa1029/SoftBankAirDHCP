// ==UserScript==
// @name         SoftBank Air Terminal 4 DHCP Status
// @version      1.1.0
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

    // 二重実行ガード
    if (document.getElementById('dhcp-status-extension')) return;

    const main = document.querySelector('.mainContent');
    const dhcpData = window.DhcpHostipRangeipData;
    // 必須項目チェック
    if (!main || !dhcpData || typeof dhcpData.dhcp_value !== 'function') return;

    // 現在の設定値を取得
    const currentStatus = String(dhcpData.dhcp_value()?.DhcpStatus);

    // ラジオボタン作成
    const html =
        `<dl id="dhcp-status-extension" class="blue">
    <dt>
        <span class="txt18 bold">DHCPサーバの有効／無効設定</span>
    </dt>
    <dd>
        <div class="bgcGray otherImg">
            <input type="radio" name="dhcpstatus" value="1" id="ds01" ${currentStatus === '1' ? 'checked' : ''}>
            <label for="ds01">有効</label>
            <input type="radio" name="dhcpstatus" value="0" id="ds02" ${currentStatus === '0' ? 'checked' : ''}>
            <label for="ds02">無効</label>
        </div>
    </dd>
</dl>`;
    main.insertAdjacentHTML('afterbegin', html);


    // 元のsubmit処理を保持
    const origsubmit = dhcpData.submit;

    // submit処理をフック(上書き)
    dhcpData.submit = function (...args) {

        // 選択中のラジオボタンの値取得
        const selectedValue = document.querySelector('input[name="dhcpstatus"]:checked')?.value;
        if (selectedValue === '0' || selectedValue === '1') {
            // 設定値をDhcpStatusに設定
            dhcpData.dhcp_value().DhcpStatus = parseInt(selectedValue, 10);
        }

        // 元のsubmit処理を実行
        return origsubmit.apply(this, args);
    };
})();
