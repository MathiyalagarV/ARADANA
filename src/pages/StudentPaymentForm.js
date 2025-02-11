import React, { useState, useRef } from 'react';
import Logo from '../imgs/logo.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCheck, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
library.add(faWhatsapp);

const StudentPaymentSystem = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        district: '',
        grade: '',
        months: [],
        date: '',
        paymentAmount: ''
    });

    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [invoiceData, setInvoiceData] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isDownloading, setIsDownloading] = useState(false);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const districts = ['Colombo', 'Jaffna']; // Available districts
    const grades = ['Basic Level', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
    const invoiceRef = useRef(null);
    const monthPickerRef = useRef(null);
    const navigate = useNavigate();

    // Close month picker when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
                setShowMonthPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMonth = (month) => {
        setFormData(prev => {
            const monthObj = { month, year: selectedYear };
            const isAlreadySelected = prev.months.some(m => m.month === month && m.year === selectedYear);

            if (isAlreadySelected) {
                return {
                    ...prev,
                    months: prev.months.filter(m => !(m.month === month && m.year === selectedYear))
                };
            }

            return {
                ...prev,
                months: [...prev.months, monthObj]
            };
        });
    };

   // Function to remove a specific month
   const removeSelectedMonth = (monthToRemove, yearToRemove) => {
    setFormData(prev => ({
      ...prev,
      months: prev.months.filter(m => !(m.month === monthToRemove && m.year === yearToRemove))
    }));
  };



    // Updated helper function to format months with years
    const formatMonths = (months) => {
        if (!months || months.length === 0) return '';

        const sortedMonths = months.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return months.findIndex(m => m.month === a.month) - months.findIndex(m => m.month === b.month);
        });

        const formattedMonths = sortedMonths.map(m => `${m.month} ${m.year}`);

        if (formattedMonths.length === 1) return formattedMonths[0];
        if (formattedMonths.length === 2) return `${formattedMonths[0]} & ${formattedMonths[1]}`;

        return formattedMonths.reduce((acc, month, index) => {
            if (index === formattedMonths.length - 1) {
                return `${acc} & ${month}`;
            }
            if (index === 0) {
                return month;
            }
            return `${acc}, ${month}`;
        }, '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.studentName.trim()) {
            errors.studentName = 'Student Name is required';
        }
        if (formData.studentName.match(/\d/)) {
            errors.studentName = 'Student name cannot contain numbers';
        }
        if (!formData.district) {
            errors.district = 'District is required';
        }
        if (!formData.grade) {
            errors.grade = 'Grade is required';
        }
        if (formData.months.length === 0) {
            errors.months = 'At least one month is required';
        }
        if (!formData.date) {
            errors.date = 'Date is required';
        }
        if (!formData.paymentAmount) {
            errors.paymentAmount = 'Payment Amount is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        setInvoiceData({ ...formData });
        setShowInvoice(true);

        setFormData({
            studentName: '',
            district: '',
            grade: '',
            months: [],
            date: '',
            paymentAmount: ''
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleSaveImage = async () => {
        if (!invoiceRef.current || isDownloading) return;

        try {
            setIsDownloading(true);

            const downloadButton = invoiceRef.current.querySelector('.invoice-actions');
            if (downloadButton) {
                downloadButton.style.display = 'none';
            }

            const element = invoiceRef.current;
            const canvas = await html2canvas(element, {
                scale: 3,
                backgroundColor: '#fff',
            });

            const image = canvas.toDataURL('image/jpeg', 1.0);
            const downloadLink = document.createElement('a');

            const currentDate = formatDate(invoiceData.date);
            const safeStudentName = invoiceData.studentName.replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `${safeStudentName}_payment_receipt_${currentDate}.jpg`;

            downloadLink.href = image;
            downloadLink.download = fileName;
            downloadLink.click();

            if (downloadButton) {
                downloadButton.style.display = 'flex';
            }
        } finally {
            setIsDownloading(false);
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="payment-system" style={styles.paymentSystem}>
            <header className="header" style={styles.header}>
                <div className="header-wave" style={styles.headerWave}></div>
                <div className="header-container" style={styles.headerContainer}>
                    <div className="logo-section" style={styles.logoSection}>
                        <img
                            src={Logo}
                            alt="Logo"
                            className="logo"
                            style={styles.logo}
                        />
                        <div style={styles.titleContainer}>
                            <h1 style={styles.schoolTitle}>ARADENA</h1>
                            <h2 style={styles.schoolhSubtitle}>SCHOOL of Music</h2>
                        </div>
                    </div>
                    <div
                        style={styles.logoutIcon}
                        onClick={handleLogout}
                        role="button"
                        tabIndex="0"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </div>
                </div>
            </header>

            <main className="main-content" style={styles.mainContent}>
                <div className="grid-container" style={styles.gridContainer}>
                    <div className="card payment-form" style={{ ...styles.card, ...styles.paymentFormCard }}>
                        <h2 className="card-title" style={styles.cardTitle}>Payment Form</h2>
                        <form onSubmit={handleSubmit} className="form" style={styles.form}>
                            <div className="form-group" style={styles.formGroup}>
                                <label className="label" style={styles.label}>Student Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    style={styles.input}
                                    value={formData.studentName}
                                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                    required
                                />
                                {formErrors.studentName && <span style={styles.error}>{formErrors.studentName}</span>}
                            </div>

                            <div className="form-group" style={styles.formGroup}>
                                <label className="label" style={styles.label}>District</label>
                                <select
                                    className="select"
                                    style={styles.select}
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    required
                                >
                                    <option value="">Select District</option>
                                    {districts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                                {formErrors.district && <span style={styles.error}>{formErrors.district}</span>}
                            </div>

                            <div className="form-group" style={styles.formGroup}>
                                <label className="label" style={styles.label}>Grade</label>
                                <select
                                    className="select"
                                    style={styles.select}
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    required
                                >
                                    <option value="">Select Grade</option>
                                    {grades.map(grade => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>
                                {formErrors.grade && <span style={styles.error}>{formErrors.grade}</span>}
                            </div>

                            {/* Month Picker with Year Selection */}
                            <div className="form-group" style={styles.formGroup}>
                                <label className="label" style={styles.label}>Select Months</label>
                                <div ref={monthPickerRef} style={styles.monthPickerContainer}>
                                    <div
                                        style={styles.monthPickerTrigger}
                                        onClick={() => setShowMonthPicker(!showMonthPicker)}
                                    >
                                        {formData.months.length > 0
                                            ? `${formData.months.length} month${formData.months.length > 1 ? 's' : ''} selected`
                                            : 'Select months'}
                                    </div>
                                    {showMonthPicker && (
                                        <div style={styles.monthPickerDropdown}>
                                            {/* Year Selection */}
                                            <div style={styles.yearSelector}>
                                                <button
                                                    onClick={() => setSelectedYear(prev => prev - 1)}
                                                    style={styles.yearButton}
                                                >
                                                    {'<'}
                                                </button>
                                                <span style={styles.yearDisplay}>{selectedYear}</span>
                                                <button
                                                    onClick={() => setSelectedYear(prev => prev + 1)}
                                                    style={styles.yearButton}
                                                >
                                                    {'>'}
                                                </button>
                                            </div>

                                            {/* Months Grid */}
                                            <div style={styles.monthGrid}>
                                                {months.map((month) => (
                                                    <div
                                                        key={month}
                                                        style={{
                                                            ...styles.monthOption,
                                                            ...(formData.months.some(m => m.month === month && m.year === selectedYear) ? styles.selectedMonth : {})
                                                        }}
                                                        onClick={() => toggleMonth(month)}
                                                    >
                                                        <span>{month}</span>
                                                        {formData.months.some(m => m.month === month && m.year === selectedYear) && (
                                                            <FontAwesomeIcon
                                                                icon={faCheck}
                                                                style={styles.checkIcon}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    )}
                                </div>
                                {formErrors.months && <span style={styles.error}>{formErrors.months}</span>}
                            </div>

                            {/* Selected Months Display */}
                            {formData.months.length > 0 && (
                                <div style={styles.selectedMonthsContainer}>
                                    <div style={styles.selectedMonths}>
                                        {formData.months.map((monthObj) => (
                                            <span key={`${monthObj.month}-${monthObj.year}`} style={styles.selectedMonthTag}>
                                                {monthObj.month} {monthObj.year}
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                    style={styles.removeIcon}
                                                    onClick={() => removeSelectedMonth(monthObj.month, monthObj.year)}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-group" style={styles.formGroup}>
                                <label className="label" style={styles.label}>Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    style={styles.input}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                                {formErrors.date && <span style={styles.error}>{formErrors.date}</span>}
                            </div>

                            <div className="form-group" style={styles.formGroup}>
                                <label className="label" style={styles.label}>Payment Amount (Rs.)</label>
                                <input
                                    type="number"
                                    className="input"
                                    style={styles.input}
                                    value={formData.paymentAmount}
                                    onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                                    required
                                />
                                {formErrors.paymentAmount && <span style={styles.error}>{formErrors.paymentAmount}</span>}
                            </div>

                            <button type="submit" className="submit-button" style={styles.submitButton}>
                                Submit Payment
                            </button>
                        </form>
                    </div>

                    {showInvoice && invoiceData && (
                        <div ref={invoiceRef} className="card invoice" style={{ ...styles.card, ...styles.invoice }}>
                            <div className="invoice-header" style={styles.invoiceHeader}>
                                <div className="logo-section" style={styles.logoSection}>
                                    <img src={Logo} alt="Logo" className="logo" style={styles.logo} />
                                    <div style={styles.titleContainer}>
                                        <h1 style={styles.schoolTitle}>ARADENA</h1>
                                        <h2 style={styles.schoolSubtitle}>SCHOOL of Music</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="receipt-date-section" style={styles.receiptDateSection}>
                                <span style={styles.receiptLabel}>Receipt</span>
                                <span style={styles.invoiceDate}>Date: {formatDate(invoiceData.date)}</span>
                            </div>

                            <div className="invoice-details" style={styles.invoiceDetails}>
                                <div className="student-details-box" style={styles.studentDetailsBox}>
                                    <h3>Payment Details:</h3>
                                    <p>Student Name: {invoiceData.studentName}</p>
                                    <p>Grade: {invoiceData.grade}</p>
                                    <p>Paid Month: {formatMonths(invoiceData.months)}</p>
                                    <p>{invoiceData.district}</p>
                                </div>

                                {/* New Separated Payment Amount Box */}
                                <div className="payment-amount-box" style={styles.paymentAmountBox}>
                                    <div style={styles.paymentAmountLabel}>Amount</div>
                                    <div style={styles.paymentAmountValue}>
                                        Rs. {invoiceData.paymentAmount} /=
                                    </div>
                                </div>

                                <div style={styles.warningNote}>
                                    <p>Note: Kindly pay your fee before 10th of every month.</p>
                                    <p style={styles.thankYouMessage}>Thank You For Your Payment!</p>
                                </div>
                            </div>

                            <div className="invoice-actions" style={styles.invoiceActions}>
                                <button
                                    className="action-button"
                                    style={styles.actionButton}
                                    onClick={handleSaveImage}
                                    disabled={isDownloading}
                                >
                                    <FontAwesomeIcon icon={faImage} style={{ marginRight: '8px' }} />
                                    {isDownloading ? 'Saving...' : 'Save as Image'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};



const styles = {
    paymentSystem: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh'
    },
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,

        backgroundColor: 'white', // Darker purple base
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 50,
        height: '80px',
        display: 'flex', // Use flexbox for alignment
        alignItems: 'center', // Vertically center items
        justifyContent: 'space-between', // Space out items
        padding: '0 24px', // Consistent padding
        boxSizing: 'border-box', // Include padding in width/height
        background: 'linear-gradient(135deg,rgb(238, 236, 240) 0%,rgb(224, 219, 226) 50%,rgb(202, 170, 216) 100%)',
    },
    headerWave: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px', // Consistent gap between logo and title
        maxWidth: '1200px',
        margin: '0 auto', // Center the container
        width: '100%', // Ensure it takes full width
    },
     invoiceHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '18px',
        fontWeight: '700',
        fontSize: '12px',
        background: 'linear-gradient(135deg, rgb(94, 19, 126) 0%, rgb(48, 20, 61) 50%, rgb(95, 6, 133) 100%)',
        padding: '16px',
        borderRadius: '8px 8px 0 0', // Rounded corners only on top
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '12px',
        },
    },


    logoSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        '@media (max-width: 768px)': {
            gap: '10px', // Reduce gap on mobile
        },
    },

    logo: {
        height: '55px',
        width: '55px',
        objectFit: 'contain',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
        '@media (max-width: 768px)': {
            height: '40px', // Smaller logo on mobile
            width: '40px',
        },
    },

    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '15px',
        '@media (max-width: 768px)': {
            marginLeft: '0', // Remove left margin on mobile
        },
    },

    schoolTitle: {
        fontSize: '28px',
        fontWeight: '900',
        color: '#783199',
        margin: 0,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: 'Arial Black, Arial, sans-serif',
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
            fontSize: '22px', // Smaller title on mobile
        },
    },

    schoolSubtitle: {
        fontSize: '10px',
        color: 'white',
        margin: 0,
        fontWeight: '600',
        letterSpacing: '1px',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'capitalize',
        opacity: 0.95,
        marginLeft: '26%',
        '@media (max-width: 768px)': {
            marginLeft: '0', // Remove left margin on mobile
            fontSize: '10px', // Smaller subtitle on mobile
        },
    },

     schoolhSubtitle: {
        fontSize: '10px',
        color: '#1F2937',
        margin: 0,
        fontWeight: '600',
        letterSpacing: '1px',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'capitalize',
        opacity: 0.95,
        marginLeft: '26%',
        '@media (max-width: 768px)': {
            marginLeft: '0', // Remove left margin on mobile
            fontSize: '10px', // Smaller subtitle on mobile
        },
    },

    invoiceMeta: {
        textAlign: 'right',
        '@media (max-width: 768px)': {
            textAlign: 'left', // Align to the left on mobile
            width: '100%', // Take full width
        },
    },

      receiptDateSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '2px solid #E5E7EB',
        marginBottom: '20px',
        '@media (max-width: 768px)': {
            padding: '8px 12px',
        },
    },

    receiptLabel: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#4C1D95',
        '@media (max-width: 768px)': {
            fontSize: '16px',
        },
    },

    invoiceDate: {
        fontSize: '16px',
        color: '#4B5563',
        '@media (max-width: 768px)': {
            fontSize: '14px',
        },
    },
    logoutIcon: {
        display: 'flex',
        alignItems: 'center', // Vertically center the icon
        justifyContent: 'center', // Center the icon horizontally
        color:  '#1F2937',
        cursor: 'pointer',
        fontSize: '20px', // Adjust the size of the icon
        padding: '15px', // Add some padding for better clickability
        borderRadius: '4px',
        transition: 'all 0.2s',
        position: 'absolute', // Position the icon absolutely
        right: '0', // Align to the right
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle hover effect
        },

    },
    ilogo: {
        height: 'auto',
        width: '80px',
          '@media (max-width: 768px)': {
             width: '40px',
          },
      },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1F2937'
    },

    monthPickerContainer: {
        position: 'relative',
        width: '100%',
    },
     monthPickerTrigger: {
        padding: '8px 12px',
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        width: 'calc(100% - 24px)',
        '@media (max-width: 768px)': {
            padding: '6px 10px',
            fontSize: '14px',
        }
    },
    monthPickerDropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        marginTop: '4px',
        maxHeight: '200px',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    yearSelector: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#F3F4F6',
        borderBottom: '1px solid #E5E7EB',
    },
    yearButton: {
        background: 'none',
        border: '1px solid #4C1D95',
        color: '#4C1D95',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: 'pointer',
    },
    yearDisplay: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#4C1D95',
    },
    monthGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        padding: '10px',
    },
    selectedMonth: {
        backgroundColor: '#4C1D95',
        color: 'white',
    },
    monthOption: {
        padding: '8px',
        border: '1px solid #E5E7EB',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#F3F4F6',
        },
    },
    checkIcon: {
        color: '#4C1D95',
    },
    selectedMonthTag: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        backgroundColor: '#4C1D95',
        color: 'white',
        borderRadius: '4px',
        fontSize: '14px',
    },
    removeIcon: {
        cursor: 'pointer',
        fontSize: '12px',
        ':hover': {
            opacity: 0.8,
        },

    },
    mainContent: {
        padding: '96px 24px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#F3F4F6',
        minHeight: '100vh',
          '@media (max-width: 768px)': {
            padding: '72px 16px 24px',
          },
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '32px'
    },
    paymentFormCard: {
        maxWidth: '600px',
        margin: '0 auto'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '24px',
          '@media (max-width: 768px)': {
            padding: '16px'
          },
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#1F2937',
          '@media (max-width: 768px)': {
             fontSize: '18px',
              marginBottom: '16px'
          },
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
          '@media (max-width: 768px)': {
             gap: '16px',
          },
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
          '@media (max-width: 768px)': {
            gap: '4px',
          },
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
          '@media (max-width: 768px)': {
             fontSize: '12px',
          },
    },
    input: {
        padding: '8px 12px',
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        backgroundColor: 'white',
        fontSize: '16px',
        width: 'calc(100% - 24px)',
          '@media (max-width: 768px)': {
            padding: '6px 10px',
             fontSize: '14px',
          },
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      fontSize: '16px',
      width: 'calc(110% - 24px)',
      backgroundColor: 'white',
          '@media (max-width: 768px)': {
           padding: '6px 10px',
           fontSize: '14px',
          },
    },
    submitButton: {
        padding: '12px 24px',
        backgroundColor: '#4C1D95',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        marginTop: '16px',
          '@media (max-width: 768px)': {
            padding: '10px 20px',
             fontSize: '14px',
             marginTop: '12px'
          },
    },
    invoice: {
        padding: '24px',
        marginTop: '24px',
          '@media (max-width: 768px)': {
            padding: '16px',
            marginTop: '16px'
          },
    },

    // invoiceHeader: {
    //     display: 'flex',
    //     justifyContent: 'space-between',
    //     alignItems: 'start',
    //     marginBottom: '18px',
    //     fontWeight: '700',
    //     fontSize: '12px',
    //       '@media (max-width: 768px)': {
    //         marginBottom: '12px',
    //       },
    // },
  

    invoiceActions: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'flex-end',
        marginTop: '16px',
          '@media (max-width: 768px)': {
            gap: '10px',
            marginTop: '12px'
          },
    },
    actionButton: {
        padding: '8px 16px',
        border: '1px solid #4B5563',
        borderRadius: '6px',
        backgroundColor: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
           '@media (max-width: 768px)': {
             padding: '6px 12px',
             fontSize: '12px',
             gap: '4px'
          },
    },



    error: {
    color: 'red',
    fontSize: '12px',
        marginTop: '4px'
    },
    'detail-row': {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0'
    },

  
    paymentAmountBox: {
        border: '2px solid #4C1D95',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#F9FAFB',
        marginTop: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '300px',
        margin: '20px auto',
    },
    paymentAmountLabel: {
        fontSize: '14px',
        color: '#4C1D95',
        fontWeight: 'bold',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    paymentAmountValue: {
        fontSize: '20px',
        color: '#1F2937',
        fontWeight: 'bold',
        padding: '8px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #E5E7EB',
    },

    // Updated styles for better layout
    invoiceDetails: {
        marginTop: '16px',
        borderTop: '1px solid rgb(97, 144, 238)',
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        '@media (max-width: 768px)': {
            paddingTop: '12px',
            marginTop: '12px',
            gap: '16px'
        },
    },
    
    studentDetailsBox: {
        border: '1px solid #E5E7EB',
        padding: '16px',
        borderRadius: '6px',
        marginTop: '-30px',
        backgroundColor: 'white',
    },
    
    
    warningNote: {
        textAlign: 'center',
        color: '#FF0000',
        fontSize: '12px',
       
        padding: '15px 0',
        fontWeight: '800',
        marginTop: '-25px'
    },
    
    thankYouMessage: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#460c5f',
        fontSize: '16px',
     
    },
    
    signatureText: {
        marginTop: '8px',
        fontSize: '14px',
        color: '#6B7280',
        fontStyle: 'italic'
    },

  };


export default StudentPaymentSystem;
