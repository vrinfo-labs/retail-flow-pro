// Web USB Type Declarations
declare global {
  interface Navigator {
    usb: USB;
  }

  interface USB {
    requestDevice(options: USBDeviceRequestOptions): Promise<USBDevice>;
    getDevices(): Promise<USBDevice[]>;
  }

  interface USBDeviceRequestOptions {
    filters: USBDeviceFilter[];
  }

  interface USBDeviceFilter {
    vendorId?: number;
    productId?: number;
    classCode?: number;
    subclassCode?: number;
    protocolCode?: number;
    serialNumber?: string;
  }

  interface USBDevice {
    vendorId: number;
    productId: number;
    deviceClass: number;
    deviceSubclass: number;
    deviceProtocol: number;
    deviceVersionMajor: number;
    deviceVersionMinor: number;
    deviceVersionSubminor: number;
    manufacturerName?: string;
    productName?: string;
    serialNumber?: string;
    configuration?: USBConfiguration;
    configurations: USBConfiguration[];
    opened: boolean;
    open(): Promise<void>;
    close(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    releaseInterface(interfaceNumber: number): Promise<void>;
    selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<void>;
    controlTransferIn(setup: USBControlTransferParameters, length: number): Promise<USBInTransferResult>;
    controlTransferOut(setup: USBControlTransferParameters, data?: ArrayBuffer | ArrayBufferView): Promise<USBOutTransferResult>;
    transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
    transferOut(endpointNumber: number, data: ArrayBuffer | ArrayBufferView): Promise<USBOutTransferResult>;
    clearHalt(direction: USBDirection, endpointNumber: number): Promise<void>;
    reset(): Promise<void>;
  }

  interface USBConfiguration {
    configurationValue: number;
    configurationName?: string;
    interfaces: USBInterface[];
  }

  interface USBInterface {
    interfaceNumber: number;
    alternate: USBAlternateInterface;
    alternates: USBAlternateInterface[];
    claimed: boolean;
  }

  interface USBAlternateInterface {
    alternateSetting: number;
    interfaceClass: number;
    interfaceSubclass: number;
    interfaceProtocol: number;
    interfaceName?: string;
    endpoints: USBEndpoint[];
  }

  interface USBEndpoint {
    endpointNumber: number;
    direction: USBDirection;
    type: USBEndpointType;
    packetSize: number;
  }

  interface USBControlTransferParameters {
    requestType: USBRequestType;
    recipient: USBRecipient;
    request: number;
    value: number;
    index: number;
  }

  interface USBInTransferResult {
    data?: DataView;
    status: USBTransferStatus;
  }

  interface USBOutTransferResult {
    bytesWritten: number;
    status: USBTransferStatus;
  }

  type USBDirection = 'in' | 'out';
  type USBEndpointType = 'bulk' | 'interrupt' | 'isochronous';
  type USBRequestType = 'standard' | 'class' | 'vendor';
  type USBRecipient = 'device' | 'interface' | 'endpoint' | 'other';
  type USBTransferStatus = 'ok' | 'stall' | 'babble';
}

// ESC/POS Commands
const ESC = 0x1b;
const GS = 0x1d;

// Alignment
const ALIGN_LEFT = new Uint8Array([ESC, 0x61, 0x00]);
const ALIGN_CENTER = new Uint8Array([ESC, 0x61, 0x01]);
const ALIGN_RIGHT = new Uint8Array([ESC, 0x61, 0x02]);

// Text formatting
const BOLD_ON = new Uint8Array([ESC, 0x45, 0x01]);
const BOLD_OFF = new Uint8Array([ESC, 0x45, 0x00]);
const DOUBLE_HEIGHT_ON = new Uint8Array([ESC, 0x21, 0x10]);
const DOUBLE_SIZE_ON = new Uint8Array([ESC, 0x21, 0x30]);
const NORMAL_SIZE = new Uint8Array([ESC, 0x21, 0x00]);

// Paper
const PARTIAL_CUT = new Uint8Array([GS, 0x56, 0x01]);
const FEED_LINES = (lines: number) => new Uint8Array([ESC, 0x64, lines]);

// Initialize printer
const INIT_PRINTER = new Uint8Array([ESC, 0x40]);

export interface PrinterDevice {
  device: USBDevice;
  endpointOut: USBEndpoint | null;
}

export interface CompanyInfo {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  company: CompanyInfo;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  cashier: string;
  operator: string;
  customer?: string;
  saleNumber: number;
  date: Date;
}

class ThermalPrinterService {
  private device: USBDevice | null = null;
  private endpointOut: USBEndpoint | null = null;
  private encoder = new TextEncoder();

  async isSupported(): Promise<boolean> {
    return 'usb' in navigator;
  }

  async requestDevice(): Promise<boolean> {
    try {
      // Request a USB device - common thermal printer vendor IDs
      this.device = await navigator.usb.requestDevice({
        filters: [
          // Common thermal printer vendors
          { vendorId: 0x0483 }, // STMic,
          { vendorId: 0x0B1B },
          { vendorId: 0x0416 }, // Winbond (many Chinese printers)
          { vendorId: 0x04b8 }, // Epson
          { vendorId: 0x0525 }, // PLX Technology
          { vendorId: 0x1504 }, // Posiflex
          { vendorId: 0x0dd4 }, // Custom Engineering
          { vendorId: 0x0fe6 }, // ICS Advent
          { vendorId: 0x0419 }, // Samsung (Bixolon)
          { vendorId: 0x154f }, // SNBC
          { vendorId: 0x0493 }, // Star Micronics
        ],
      });

      return true;
    } catch (error) {
      console.error('Error requesting USB device:', error);
      return false;
    }
  }

  async connect(): Promise<boolean> {
    if (!this.device) {
      return false;
    }

    try {
      await this.device.open();

      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }

      // Find the first interface with a bulk OUT endpoint
      for (const iface of this.device.configuration!.interfaces) {
        for (const alternate of iface.alternates) {
          for (const endpoint of alternate.endpoints) {
            if (endpoint.direction === 'out' && endpoint.type === 'bulk') {
              await this.device.claimInterface(iface.interfaceNumber);
              this.endpointOut = endpoint;
              return true;
            }
          }
        }
      }

      // If no bulk endpoint found, try the first interface
      await this.device.claimInterface(0);
      return true;
    } catch (error) {
      console.error('Error connecting to printer:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        await this.device.close();
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
      this.device = null;
      this.endpointOut = null;
    }
  }

  isConnected(): boolean {
    return this.device !== null && this.device.opened;
  }

  getDeviceName(): string | null {
    return this.device?.productName || null;
  }

  private async write(data: Uint8Array): Promise<void> {
    if (!this.device || !this.device.opened) {
      throw new Error('Printer not connected');
    }

    try {
      if (this.endpointOut) {
        await this.device.transferOut(this.endpointOut.endpointNumber, data);
      } else {
        // Fallback to control transfer for printers without bulk endpoint
        await this.device.controlTransferOut(
          {
            requestType: 'class',
            recipient: 'interface',
            request: 0x09,
            value: 0x0300,
            index: 0,
          },
          data
        );
      }
    } catch (error) {
      console.error('Error writing to printer:', error);
      throw error;
    }
  }

  private async printText(text: string): Promise<void> {
    const encoded = this.encoder.encode(text + '\n');
    await this.write(encoded);
  }

  private async printLine(char: string = '-', length: number = 48): Promise<void> {
    await this.printText(char.repeat(length));
  }

  private formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private padRight(text: string, length: number): string {
    return text.padEnd(length).substring(0, length);
  }

  private padLeft(text: string, length: number): string {
    return text.padStart(length).substring(0, length);
  }

  async printReceipt(data: ReceiptData): Promise<void> {
    try {
      // Initialize printer
      await this.write(INIT_PRINTER);

      // Header - Company info
      await this.write(ALIGN_CENTER);
      await this.write(DOUBLE_SIZE_ON);
      await this.printText(data.company.name);
      await this.write(NORMAL_SIZE);
      await this.printText(`CNPJ: ${data.company.cnpj}`);
      await this.printText(data.company.address);
      await this.printText(`Tel: ${data.company.phone}`);
      
      await this.printLine('=');

      // Sale info
      await this.write(ALIGN_LEFT);
      await this.write(BOLD_ON);
      await this.printText(`CUPOM NAO FISCAL`);
      await this.write(BOLD_OFF);
      await this.printText(`Venda #${data.saleNumber.toString().padStart(6, '0')}`);
      await this.printText(`Data: ${this.formatDate(data.date)}`);
      await this.printText(`Caixa: ${data.cashier}`);
      await this.printText(`Operador: ${data.operator}`);
      if (data.customer) {
        await this.printText(`Cliente: ${data.customer}`);
      }

      await this.printLine('-');

      // Items
      await this.write(BOLD_ON);
      await this.printText('ITEM                        QTD    VALOR');
      await this.write(BOLD_OFF);
      await this.printLine('-');

      for (const item of data.items) {
        const name = this.padRight(item.name, 26);
        const qty = this.padLeft(item.quantity.toString(), 4);
        const value = this.padLeft(this.formatCurrency(item.price * item.quantity), 10);
        await this.printText(`${name} ${qty} ${value}`);
        if (item.quantity > 1) {
          await this.printText(`  ${item.quantity}x ${this.formatCurrency(item.price)}`);
        }
      }

      await this.printLine('-');

      // Totals
      await this.write(ALIGN_RIGHT);
      await this.printText(`Subtotal: ${this.formatCurrency(data.subtotal)}`);
      
      if (data.discount > 0) {
        await this.printText(`Desconto: -${this.formatCurrency(data.discount)}`);
      }

      await this.write(BOLD_ON);
      await this.write(DOUBLE_HEIGHT_ON);
      await this.printText(`TOTAL: ${this.formatCurrency(data.total)}`);
      await this.write(NORMAL_SIZE);
      await this.write(BOLD_OFF);

      await this.printLine('-');

      // Payment info
      await this.write(ALIGN_LEFT);
      await this.printText(`Forma de Pagamento: ${data.paymentMethod}`);
      await this.printText(`Valor Pago: ${this.formatCurrency(data.amountPaid)}`);
      
      if (data.change > 0) {
        await this.printText(`Troco: ${this.formatCurrency(data.change)}`);
      }

      await this.printLine('=');

      // Footer
      await this.write(ALIGN_CENTER);
      await this.printText('Obrigado pela preferencia!');
      await this.printText('Volte sempre!');
      await this.printText('');
      await this.printText('VarejoERP - Sistema de Gestao');

      // Feed and cut
      await this.write(FEED_LINES(4));
      await this.write(PARTIAL_CUT);

    } catch (error) {
      console.error('Error printing receipt:', error);
      throw error;
    }
  }

  async printTestPage(): Promise<void> {
    try {
      await this.write(INIT_PRINTER);
      await this.write(ALIGN_CENTER);
      await this.write(DOUBLE_SIZE_ON);
      await this.printText('TESTE DE IMPRESSAO');
      await this.write(NORMAL_SIZE);
      await this.printLine('=');
      await this.printText('Impressora configurada com sucesso!');
      await this.printText(`Data: ${this.formatDate(new Date())}`);
      await this.printLine('=');
      await this.printText('VarejoERP');
      await this.write(FEED_LINES(4));
      await this.write(PARTIAL_CUT);
    } catch (error) {
      console.error('Error printing test page:', error);
      throw error;
    }
  }

  async openCashDrawer(): Promise<void> {
    // Standard cash drawer kick pulse
    const OPEN_DRAWER = new Uint8Array([ESC, 0x70, 0x00, 0x19, 0xfa]);
    await this.write(OPEN_DRAWER);
  }
}

export const thermalPrinter = new ThermalPrinterService();
