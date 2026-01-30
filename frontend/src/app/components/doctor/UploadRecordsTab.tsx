import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Camera, Sparkles, Check } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';

export function UploadRecordsTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState('prescription');
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const recordTypes = [
    { id: 'prescription', name: 'Prescription', icon: '💊' },
    { id: 'lab', name: 'Lab Report', icon: '🧪' },
    { id: 'xray', name: 'X-Ray/Scan', icon: '🩻' },
    { id: 'notes', name: 'Clinical Notes', icon: '📝' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      setTimeout(() => {
        setUploaded(false);
        setSelectedFile(null);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Upload Medical Records
        </h2>
        <p className="text-sm text-muted-foreground">
          Add prescriptions, scans, and notes to patient records
        </p>
      </Card>

      {/* Patient Selection */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3">Select Patient</h3>
        <Input
          type="text"
          placeholder="Enter Patient ID or scan QR code"
          icon={<FileText className="w-5 h-5" />}
        />
        <div className="mt-3 p-3 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Rajesh Kumar</p>
              <p className="text-sm text-muted-foreground">ID: KL-MW-2025-12345</p>
            </div>
            <Badge variant="success">Selected</Badge>
          </div>
        </div>
      </Card>

      {/* Record Type Selection */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3">Record Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recordTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setRecordType(type.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                recordType === type.id
                  ? 'border-[#0b6e4f] bg-[#e8f5e9]'
                  : 'border-border hover:border-[#0b6e4f]/50'
              }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Upload Area */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3">Upload Document</h3>
        
        {!selectedFile ? (
          <div className="space-y-4">
            <motion.label
              htmlFor="file-upload"
              className="block border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-[#0b6e4f] hover:bg-accent transition-all"
              whileHover={{ scale: 1.01 }}
            >
              <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="font-semibold text-foreground mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, JPG, PNG up to 10MB
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </motion.label>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Or</p>
              <Button variant="outline" icon={<Camera className="w-4 h-4" />}>
                Take Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!uploaded ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-accent rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-[#0b6e4f]" />
                    <div>
                      <p className="font-semibold text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>

                {/* AI Auto-tagging */}
                <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mb-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-foreground mb-1">
                        AI Auto-Tagging
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Document analyzed and tagged automatically
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Add notes or description..."
                    label="Notes (Optional)"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Language
                    </label>
                    <div className="flex gap-2">
                      {['English', 'Malayalam', 'Hindi'].map((lang) => (
                        <button
                          key={lang}
                          className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm hover:border-[#0b6e4f] transition-all text-white"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleUpload}
                  disabled={uploading}
                  icon={uploading ? undefined : <Upload className="w-5 h-5" />}
                  className="mt-4"
                >
                  {uploading ? 'Uploading...' : 'Upload & Link to Patient'}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Upload Successful!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Record has been added to patient's health history
                </p>
              </motion.div>
            )}
          </div>
        )}
      </Card>

      {/* AI Features */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">AI-Powered Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Automatic document classification</li>
              <li>✓ Text extraction from images</li>
              <li>✓ Multi-language support & auto-translation</li>
              <li>✓ Smart tagging and indexing</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3">Recent Uploads</h3>
        <div className="space-y-2">
          {[
            { name: 'Blood Test Report', date: '2 hours ago', type: 'Lab Report' },
            { name: 'Prescription - Diabetes', date: 'Yesterday', type: 'Prescription' },
          ].map((item, index) => (
            <div
              key={index}
              className="p-3 bg-muted rounded-lg flex items-center justify-between hover:bg-accent transition-all"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#0b6e4f]" />
                <div>
                  <p className="font-medium text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} • {item.date}
                  </p>
                </div>
              </div>
              <Badge variant="success">✓</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}