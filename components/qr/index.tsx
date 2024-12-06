"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button, Input } from "@nextui-org/react";

export const Qr = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [count, setCount] = useState(5); // Nombre de QR codes à générer

  // Charger le fichier PDF de base
  const loadBasePdf = async () => {
    const response = await fetch("/scan.pdf"); // Assure-toi que le fichier est dans le dossier "public"
    const basePdfBytes = await response.arrayBuffer();
    return basePdfBytes;
  };

  // Fonction pour générer une chaîne aléatoire avec le préfixe "Qr-"
  const generateRandomData = () => {
    const randomNumber = Math.floor(Math.random() * 1_000_000_000); // Génère un nombre entre 0 et 999999999
    return `Aigle-${randomNumber}`;
  };

  // Fonction pour générer plusieurs QR codes
  const generateQRCodes = async () => {
    const newQrCodes = [];
    for (let i = 0; i < count; i++) {
      const randomData = generateRandomData();
      const qrCode = await QRCode.toDataURL(randomData); // Génère un QR code en base64
      newQrCodes.push({ data: randomData, qrCode });
    }
    setQrCodes(newQrCodes);
  };

  // Créer un PDF pour chaque QR code
  const generatePdfWithQrCode = async (qrCodeBase64) => {
    const basePdfBytes = await loadBasePdf();
    const pdfDoc = await PDFDocument.load(basePdfBytes);

    // Charger le QR code en tant qu'image
    const qrImageBytes = await fetch(qrCodeBase64).then((res) =>
      res.arrayBuffer()
    );
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Dimensions de la page
    const { width, height } = firstPage.getSize();

    // Dimensions du cadre blanc (ajuste ces valeurs pour qu'elles correspondent au cadre de ton PDF)
    const frameWidth = 780; // Largeur du cadre blanc
    const frameHeight = 740; // Hauteur du cadre blanc

    // Calcul pour centrer le QR code dans le cadre blanc
    const x = (width - frameWidth) / 2;
    const y = (height - frameHeight) / 2;

    // Dessiner le QR code pour qu'il couvre tout le cadre sans marges
    firstPage.drawImage(qrImage, {
      x,
      y,
      width: frameWidth,
      height: frameHeight,
    });

    return await pdfDoc.save();
  };

  // Fonction pour créer les PDF et les compresser dans un ZIP
  const downloadAsZip = async () => {
    const zip = new JSZip();

    for (let i = 0; i < qrCodes.length; i++) {
      const { data, qrCode } = qrCodes[i];

      // Générer le PDF avec le QR code intégré
      const pdfBytes = await generatePdfWithQrCode(qrCode);

      // Ajouter le PDF au ZIP
      zip.file(`${data}.pdf`, pdfBytes);
    }

    // Générer et télécharger le ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "qrcodes_with_base_pdf.zip");
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1 className="text-xl font-semibold">Générateur de QR Codes</h1>
        <br />
        <label>Nombre de QR Codes à générer (max : 500 per request)</label>
        <div className="flex gap-12 mt-8">
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

          <Button
            color="primary"
            onClick={generateQRCodes}
            style={{ marginLeft: "10px" }}
          >
            Générer
          </Button>
        </div>

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
                className="rounded-lg"
              />
            </div>
          ))}
        </div>

        {qrCodes.length > 0 && (
          <Button
            color="success"
            onClick={downloadAsZip}
            style={{ marginTop: "20px" }}
          >
            Télécharger en ZIP
          </Button>
        )}
      </div>
    </>
  );
};
