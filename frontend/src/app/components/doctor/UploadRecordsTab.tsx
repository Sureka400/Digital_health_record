import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Camera, Sparkles, Check } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { api } from '@/app/utils/api';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

export function UploadRecordsTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patientId, setPatientId] = useState('6981fe42f8fab946afe86511');
  const [recordType, setRecordType] = useState('prescription');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hospital, setHospital] = useState('Medical College Hospital, Trivandrum');
  const [doctor, setDoctor] = useState('Dr. Anjali Menon');
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordTypes = [
    { id: 'prescription', name: t('prescription'), icon: '💊' },
    { id: 'lab', name: t('labReport'), icon: '🧪' },
    { id: 'imaging', name: t('xrayScan'), icon: '🩻' },
    { id: 'notes', name: t('clinicalNotes'), icon: '📝' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setTitle(event.target.files[0].name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    try {
      await api.upload('/records', selectedFile, {
        title,
        category: recordType,
        description,
        hospital,
        doctor,
        patientId,
      });
      setUploaded(true);
      setTimeout(() => {
        setUploaded(false);
        setSelectedFile(null);
        setTitle('');
        setDescription('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('uploadRecordsTitle')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('uploadRecordsDesc')}
        </p>
      </Card>

      {/* Patient Selection */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3">{t('selectPatient')}</h3>
        <Input
          type="text"
          placeholder={t('patientIdPlaceholder')}
          icon={<FileText className="w-5 h-5" />}
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <div className="mt-3 p-3 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">
                {patientId === '6981fe42f8fab946afe86511' ? 'John Doe' : t('unknownPatient')}
              </p>
              <p className="text-sm text-muted-foreground">{t('id')}: {patientId}</p>
            </div>
            <Badge variant="success">{t('eligible')}</Badge>
          </div>
        </div>
      </Card>

      {/* Record Type Selection */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3">{t('recordType')}</h3>
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
        <h3 className="font-semibold text-foreground mb-3">{t('uploadDocument')}</h3>
        
        {!selectedFile ? (
          <div className="space-y-4">
            <motion.label
              htmlFor="file-upload"
              className="block border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-[#0b6e4f] hover:bg-accent transition-all"
              whileHover={{ scale: 1.01 }}
            >
              <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="font-semibold text-foreground mb-1">
                {t('dropFilesDesc')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('uploadFormatsDesc')}
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
                {t('takePhoto')}
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
                        {t('aiAutoTagging')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('aiAutoTaggingDesc')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder={t('recordTitle')}
                    label={t('title')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder={t('askAnything')}
                    label={t('notesOptional')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder={t('hospitalName')}
                    label={t('hospital')}
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder={t('doctorName')}
                    label={t('doctor')}
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                  />
                  
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleUpload}
                    disabled={uploading}
                    icon={uploading ? undefined : <Upload className="w-5 h-5" />}
                    className="mt-4"
                  >
                    {uploading ? t('processing') : t('uploadAndLink')}
                  </Button>
                </div>
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
                  {t('uploadSuccessful')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('uploadSuccessfulDesc')}
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
            <h3 className="font-semibold text-foreground mb-1">{t('aiPoweredFeatures')}</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ {t('autoClassification')}</li>
              <li>✓ {t('textExtraction')}</li>
              <li>✓ {t('multiLangSupport')}</li>
              <li>✓ {t('smartTagging')}</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3">{t('recentUploads')}</h3>
        <div className="space-y-2">
          {[
            { name: 'Blood Test Report', date: '2 hours ago', type: t('labReport') },
            { name: 'Prescription - Diabetes', date: 'Yesterday', type: t('prescription') },
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
