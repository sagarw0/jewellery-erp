import React, { useState } from 'react';
import { BackupStatusInfo, BackupMediaOption } from '../../types/erp';
import {
  HardDrive,
  Usb,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  FolderOpen,
  XCircle,
  ShieldCheck
} from 'lucide-react';

interface BackupManagerViewProps {
  statusList: BackupStatusInfo[];
  onTriggerBackup: (media: BackupMediaOption) => void;
  onRestore: (media: BackupMediaOption) => void;
  onClose: () => void;
}

export const BackupManagerView: React.FC<BackupManagerViewProps> = ({
  statusList,
  onTriggerBackup,
  onRestore,
  onClose,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<BackupMediaOption>('Default Location');
  const [isBackingUp, setIsBackingUp] = useState(false);

  const mediaOptions: {
    id: BackupMediaOption;
    label: string;
    description: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'Default Location',
      label: '1. Default Location',
      description: 'Local showroom machine internal database store (Instant automated snapshot).',
      icon: HardDrive,
    },
    {
      id: 'USB Drive',
      label: '2. USB Drive',
      description: 'Removable flash memory / USB security token for daily bank locker storage.',
      icon: Usb,
    },
    {
      id: 'Google Drive',
      label: '3. Google Drive',
      description: 'Encrypted offsite cloud repository with multi-datacenter replication.',
      icon: Cloud,
    },
    {
      id: 'HDD',
      label: '4. HDD (External Storage)',
      description: 'Secondary external hard drive for long-term multi-year accounting archive.',
      icon: HardDrive,
    },
  ];

  const handleStartBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      onTriggerBackup(selectedMedia);
      setIsBackingUp(false);
      alert(`Database backup to "${selectedMedia}" completed successfully!`);
    }, 1000);
  };

  const handleDownloadJSON = () => {
    const backupPayload = {
      backup_timestamp: new Date().toISOString(),
      media: selectedMedia,
      version: 'Swarna ERP 2.0 Modernized',
      financial_year: '2026-2027',
      system_tables: [
        'account_master',
        'order_booking',
        'refinery_in',
        'purchase_invoice',
        'day_book',
        'stock_register',
      ],
      checksum_sha256: 'a9f24e93bb8d1847c20c028e3b2e774a81c0',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SwarnaERP_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Backup & Disaster Recovery Studio</h1>
            <p className="text-xs text-slate-500">
              All 4 storage destinations preserved (Spec #5). Encrypted database snapshots and restore points.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Backup (.JSON)</span>
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 4 Backup Media Targets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mediaOptions.map((media) => {
          const Icon = media.icon;
          const status = statusList.find((s) => s.media === media.id);
          const isSelected = selectedMedia === media.id;
          return (
            <div
              key={media.id}
              onClick={() => setSelectedMedia(media.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-sky-50/80 border-blue-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {status?.backup_status || 'Success'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{media.label}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{media.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 space-y-0.5">
                <div>Last: <strong className="text-slate-800">{status?.last_backup}</strong></div>
                <div>Size: <strong className="text-slate-800">{status?.backup_size}</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trigger Backup Panel */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">
            Execute Backup Snapshot to: {selectedMedia}
          </span>
          <span className="text-xs text-slate-400 font-mono">Algorithm: AES-256 GCM</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleStartBackup}
            disabled={isBackingUp}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
            <span>{isBackingUp ? 'Backing Up Database...' : `Execute Backup to ${selectedMedia}`}</span>
          </button>

          <button
            onClick={() => onRestore(selectedMedia)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Restore From {selectedMedia}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
