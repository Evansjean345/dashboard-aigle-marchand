"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button, Input } from "@nextui-org/react";

export const Qr = () => {
  const [qrCodes, setQrCodes] = useState([]); // QR codes générés
  const [count, setCount] = useState(1); // Nombre de QR codes
  const [pdfFile, setPdfFile] = useState("/a5_white.pdf"); // Fichier PDF par défaut

  // Fonction pour charger le fichier PDF de base
  const loadBasePdf = async () => {
    const response = await fetch(pdfFile); // Charge le PDF sélectionné
    const basePdfBytes = await response.arrayBuffer();
    return basePdfBytes;
  };

  // Fonction pour générer une chaîne aléatoire unique
  const generateRandomData = () => {
    const randomNumber = Math.floor(Math.random() * 1_000_000_000);
    return `Aigle-${randomNumber}`;
  };

  // Générer plusieurs QR codes
  const generateQRCodes = async () => {
    const newQrCodes = [];
    for (let i = 0; i < count; i++) {
      const randomData = generateRandomData();
      const qrCode = await QRCode.toDataURL(randomData); // QR code en base64
      newQrCodes.push({ data: randomData, qrCode });
    }
    setQrCodes(newQrCodes); // Met à jour l'état avec les QR codes générés
  };

  // Fonction pour ajouter un QR code au centre d'une page PDF
  const generatePdfWithQrCode = async (qrCodeBase64) => {
    const basePdfBytes = await loadBasePdf(); // Charge le PDF
    const pdfDoc = await PDFDocument.load(basePdfBytes);

    const qrImageBytes = await fetch(qrCodeBase64).then((res) =>
      res.arrayBuffer()
    );
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    // Taille du QR code : 40% de la page
    const qrSize = Math.min(width, height) * 0.6;

    const x = (width - qrSize) / 2; // Centrage horizontal
    const y = (height - qrSize) / 2; // Centrage vertical

    firstPage.drawImage(qrImage, {
      x,
      y,
      width: qrSize,
      height: qrSize,
    });

    return await pdfDoc.save(); // Retourne le PDF modifié
  };

  // Télécharger les PDF avec QR codes dans un fichier ZIP
  const downloadAsZip = async () => {
    const zip = new JSZip();

    for (let i = 0; i < qrCodes.length; i++) {
      const { data, qrCode } = qrCodes[i];
      const pdfBytes = await generatePdfWithQrCode(qrCode);

      // Ajout du PDF au ZIP
      zip.file(`${data}.pdf`, pdfBytes);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "qrcodes_with_pdfs.zip");
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1 className="text-xl font-semibold">Générateur de QR Codes</h1>
        <br />
        {/* Choisir un fichier PDF */}
        <label>Choisissez un fichier PDF :</label>
        &nbsp; &nbsp; &nbsp;
        <select
          value={pdfFile}
          onChange={(e) => setPdfFile(e.target.value)}
          style={{
            marginBottom: "20px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        >
          <option value="/a5_white.pdf">A5 Blanc - modèle 1</option>
          <option value="/pvc_white.pdf">PVC Blanc - modèle 1</option>
          <option value="/a5_green.pdf">A5 Vert - modèle 1</option>
          <option value="/pvc_green.pdf">PVC Vert - modèle 1</option>
          <option value="/a5_2_green.pdf">A5 Vert - modèle 2</option>
          <option value="/pvc_2_green.pdf">PVC Vert - modèle 2</option>
        </select>
        <br />
        {/* Entrer le nombre de QR Codes */}
        <label>Nombre de QR Codes à générer (max : 500) :</label>
        <div className="flex gap-12 mt-4">
          <Input
            type="number"
            value={count.toString()}
            onChange={(e) =>
              setCount(Math.min(Math.max(parseInt(e.target.value, 10), 1), 500))
            }
            min="1"
            max="500"
            className="w-24"
          />

          <Button color="primary" onClick={generateQRCodes}>
            Générer les QR Codes
          </Button>
        </div>
        {/* Affichage des QR Codes */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {qrCodes.map((qr, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <img
                src={qr.qrCode}
                alt={`QR Code ${index + 1}`}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          ))}
        </div>
        {/* Bouton pour télécharger les PDF */}
        {qrCodes.length > 0 && (
          <Button
            color="success"
            onClick={downloadAsZip}
            style={{ marginTop: "20px" }}
          >
            Télécharger les PDF avec QR Codes
          </Button>
        )}
      </div>
    </>
  );
};
