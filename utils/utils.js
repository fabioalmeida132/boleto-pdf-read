class Utils {
    constructor(typeableLine) {
        this.typeableLine = typeableLine;
        this.bankSlipNumber = typeableLine.replace(/[^\d]/g, '');
    }
    slipTypeableLine() {
        return this.bankSlipNumber.replace(
            /^(\d{4})(\d{5})\d{1}(\d{10})\d{1}(\d{10})\d{1}(\d{15})$/,
            '$1$5$2$3$4',
        );
    }
    getFormated() {
        return this.bankSlipNumber.replace(
            /^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})$/,
            '$1.$2 $3.$4 $5.$6 $7 $8',
        );
    }
    getBank() {
        switch (this.typeableLine.slice(0, 3)) {
            case '001': return 'Banco do Brasil';
            case '007': return 'BNDES';
            case '033': return 'Santander';
            case '069': return 'Crefisa';
            case '077': return 'Banco Inter';
            case '102': return 'XP Investimentos';
            case '104': return 'Caixa Econômica Federal';
            case '140': return 'Easynvest';
            case '197': return 'Stone';
            case '208': return 'BTG Pactual';
            case '212': return 'Banco Original';
            case '237': return 'Bradesco';
            case '260': return 'Nu Pagamentos';
            case '341': return 'Itaú';
            case '389': return 'Banco Mercantil do Brasil';
            case '422': return 'Banco Safra';
            case '505': return 'Credit Suisse';
            case '633': return 'Banco Rendimento';
            case '652': return 'Itaú Unibanco';
            case '735': return 'Banco Neon';
            case '739': return 'Banco Cetelem';
            case '745': return 'Citibank';
            default: return null;
        }
    }
    getExpirationDate() {
        const refDate = new Date(876236400000); // 1997-10-07 12:00:00 GMT-0300
        const days = this.slipTypeableLine().substr(5, 4);
        return new Date(refDate.getTime() + (days * 86400000));
    }
    getAmount() {
        return Number((this.slipTypeableLine().substr(9, 10) / 100.0).toFixed(2));
    }
}

module.exports = Utils;
