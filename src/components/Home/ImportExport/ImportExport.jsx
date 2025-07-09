import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog"
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";

export const ImportExport = ({
  importExportVisible,
  setImportExportVisible,
  importExport,
  importExportData,
  saveImportData
}) => {
  const [copied, setCopied] = useState(false);
  const [importData, setImportData] = useState('')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(importExportData)
      setCopied(true)
    } catch (err) {
      console.log('faied to copy text', err)
    }
  }

  return (
    <Dialog
      header={importExport}
      visible={importExportVisible}
      onHide={() => {
        if (!importExportVisible) return;
        setImportExportVisible(false);
        setCopied(false);
        setImportData('');
      }}
      style={{width: '50vw'}}
    >
      <div>
        {
          importExport === 'export' ? (
            <Button
              className="mb-3 mt-1 "
              icon="pi pi-copy"
              rounded
              text
              raised
              label={copied ? 'Data Copied!' : null}
              aria-label="Copy"
              onClick={handleCopy}
              tooltip="Copy Data"
              tooltipOptions={{ position: 'bottom' }}
            />
          ) : null
        }
        
        <InputTextarea
          className="w-full"
          rows={25}
          value={importExport === 'export' ? importExportData : importData}
          readOnly={importExport === 'export' ? true : false}
          onChange={(e) => setImportData(e.target.value)}
        />
        {
          importExport === 'import' ? (
            <div className="flex justify-content-end">
              <Button
                label="Save"
                className="mt-3"
                onClick={() => {
                  saveImportData(importData);
                  setImportData('')
                }}
              />
            </div>
          ) : null
        }
      </div>
    </Dialog>
  )
}