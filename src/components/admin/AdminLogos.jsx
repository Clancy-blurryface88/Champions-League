
import React, { useState, useEffect } from "react";
import { TeamLogo } from "@/api/entities";
import { UploadFile } from "@/api/functions";
import { motion } from "framer-motion";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoaderBar } from "../ui/LoaderBar"; // Updated import

export default function AdminLogos() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoFile, setNewLogoFile] = useState(null);

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    setLoading(true);
    try {
      const data = await TeamLogo.list('-created_date');
      setLogos(data);
    } catch (error) {
      console.error("Error loading logos:", error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setNewLogoFile(e.target.files[0]);
    }
  };

  const handleAddLogo = async () => {
    if (!newLogoName || !newLogoFile) {
      alert("Please provide a name and select a file.");
      return;
    }
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file: newLogoFile });
      await TeamLogo.create({
        name: newLogoName,
        logo_url: file_url,
      });
      setNewLogoName('');
      setNewLogoFile(null);
      if (document.getElementById('logo-file-input')) {
        document.getElementById('logo-file-input').value = ''; 
      }
      loadLogos();
    } catch (error) {
      console.error("Error adding logo:", error);
      alert("Failed to add logo.");
    }
    setUploading(false);
  };

  const handleDeleteLogo = async (logoId) => {
    if (window.confirm("Are you sure you want to delete this logo?")) {
      try {
        await TeamLogo.delete(logoId);
        loadLogos();
      } catch (error) {
        console.error("Error deleting logo:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Add New Team Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logo-name" className="text-slate-300">Team Name</Label>
            <Input
              id="logo-name"
              value={newLogoName}
              onChange={(e) => setNewLogoName(e.target.value)}
              placeholder="e.g., Real Madrid"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="logo-file-input" className="text-slate-300">Logo Image</Label>
            <Input
              id="logo-file-input"
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              onChange={handleFileChange}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Button onClick={handleAddLogo} disabled={uploading || !newLogoName || !newLogoFile} className="bg-blue-600 hover:bg-blue-700">
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {uploading ? 'Uploading...' : 'Upload & Save Logo'}
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold text-white pt-6">Logo Library</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoaderBar text="LOADING" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {logos.map((logo) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <Card className="bg-slate-800/80 border border-slate-700 aspect-square flex items-center justify-center p-4">
                <img src={logo.logo_url} alt={logo.name} className="max-w-full max-h-full object-contain" />
              </Card>
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-2">
                 <p className="text-white font-semibold text-sm mb-2">{logo.name}</p>
                 <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteLogo(logo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
       { !loading && logos.length === 0 && (
          <p className="text-slate-400 text-center py-8">Your logo library is empty. Add a logo to get started.</p>
        )}
    </div>
  );
}
