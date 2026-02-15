/* ============================================
   BOOKING SYSTEM JAVASCRIPT
   Sistema de Reservas - Mimas Iconic
   ============================================ */

// ============================================
// CONFIGURATION (via Vercel API)
// ============================================
const BOOKING_ENDPOINT = '/api/booking';

// Opcional: fallback WhatsApp si falla el envío (pon tu número real)
const WHATSAPP_NUMBER = '34648917579'; // ejemplo: 34612345678 (sin +)


// Business hours configuration
const BUSINESS_HOURS = {
    // Formato: "HH:MM"
    start: "10:00",
    end: "20:00",
    // Día cerrado: Sunday (0-6, donde 0 es Domingo)
    closedDays: [0], // Domingo cerrado
    // Sábado horario especial
    specialHours: {
        6: { start: "10:00", end: "14:00" } // Sábado hasta las 14:00
    },
    // Intervalo de slots (en minutos)
    slotInterval: 30
};

// ============================================
// STATE MANAGEMENT
// ============================================
let currentStep = 1;
let bookingData = {
    service: null,
    serviceName: null,
    price: null,
    duration: null,
    date: null,
    time: null,
    name: null,
    email: null,
    phone: null,
    notes: null
};

let currentMonth = new Date();
let selectedDate = null;

// ============================================
// STEP NAVIGATION
// ============================================
function nextStep(step) {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Update steps indicator
    const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    const nextStepEl = document.querySelector(`.step[data-step="${step}"]`);
    
    if (currentStepEl) {
        currentStepEl.classList.remove('active');
        currentStepEl.classList.add('completed');
    }
    
    if (nextStepEl) {
        nextStepEl.classList.add('active');
    }
    
    // Update form steps
    const currentFormStep = document.getElementById(`step-${currentStep}`);
    const nextFormStep = document.getElementById(`step-${step}`);
    
    if (currentFormStep) {
        currentFormStep.classList.remove('active');
    }
    
    if (nextFormStep) {
        nextFormStep.classList.add('active');
    }
    
    currentStep = step;
    
    // Special handling for step 4 (confirmation)
    if (step === 4) {
        updateSummary();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    // Update steps indicator
    const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    const prevStepEl = document.querySelector(`.step[data-step="${step}"]`);
    
    if (currentStepEl) {
        currentStepEl.classList.remove('active');
    }
    
    if (prevStepEl) {
        prevStepEl.classList.remove('completed');
        prevStepEl.classList.add('active');
    }
    
    // Update form steps
    const currentFormStep = document.getElementById(`step-${currentStep}`);
    const prevFormStep = document.getElementById(`step-${step}`);
    
    if (currentFormStep) {
        currentFormStep.classList.remove('active');
    }
    
    if (prevFormStep) {
        prevFormStep.classList.add('active');
    }
    
    currentStep = step;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// VALIDATION
// ============================================
function validateStep(step) {
    switch(step) {
        case 1:
            const selectedService = document.querySelector('input[name="service"]:checked');
            if (!selectedService) {
                alert('Por favor, selecciona un servicio');
                return false;
            }
            // Save service data
            bookingData.service = selectedService.value;
            const serviceCard = selectedService.closest('.service-option')?.querySelector('.service-card-booking');
            bookingData.serviceName =
                selectedService.closest('.service-option')?.querySelector('.service-card-booking h3')?.textContent?.trim() || '';
      
            bookingData.price = selectedService.dataset.price;
            bookingData.duration = selectedService.dataset.duration;
            return true;
            
        case 2:
            if (!bookingData.date || !bookingData.time) {
                alert('Por favor, selecciona una fecha y hora');
                return false;
            }
            return true;
            
        case 3:
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const terms = document.getElementById('terms').checked;
            
            if (!name || !email || !phone) {
                alert('Por favor, completa todos los campos obligatorios');
                return false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, introduce un email válido');
                return false;
            }
            
            // Validate phone (9 digits)
            const phoneRegex = /^[0-9]{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('Por favor, introduce un teléfono válido (9 dígitos)');
                return false;
            }
            
            if (!terms) {
                alert('Debes aceptar la política de privacidad y cancelación');
                return false;
            }
            
            // Save personal data
            bookingData.name = name;
            bookingData.email = email;
            bookingData.phone = phone;
            bookingData.notes = document.getElementById('notes').value.trim();
            return true;
            
        default:
            return true;
    }
}

// ============================================
// CALENDAR FUNCTIONALITY
// ============================================
function initCalendar() {
    renderCalendar();
    
    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Update header
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.getElementById('calendar-month').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    
    // Day headers
    const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayHeaders.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day header';
        dayEl.textContent = day;
        grid.appendChild(dayEl);
    });
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.textContent = daysInPrevMonth - i;
        grid.appendChild(dayEl);
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        // Check if today
        if (date.toDateString() === today.toDateString()) {
            dayEl.classList.add('today');
        }
        
        // Check if disabled (past or closed day)
        if (date < today.setHours(0,0,0,0) || BUSINESS_HOURS.closedDays.includes(date.getDay())) {
            dayEl.classList.add('disabled');
        } else {
            dayEl.addEventListener('click', () => selectDate(date, dayEl));
        }
        
        // Check if selected
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            dayEl.classList.add('selected');
        }
        
        grid.appendChild(dayEl);
    }
    
    // Next month days
    const remainingDays = 42 - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingDays; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.textContent = day;
        grid.appendChild(dayEl);
    }
}

function selectDate(date, element) {
    selectedDate = date;
    bookingData.date = date.toISOString().split('T')[0];
    
    // Update visual selection
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Show time slots
    renderTimeSlots(date);
    document.getElementById('time-selection').style.display = 'block';
}

function renderTimeSlots(date) {
    const dayOfWeek = date.getDay();
    const slots = generateTimeSlots(dayOfWeek);
    const slotsContainer = document.getElementById('time-slots');
    slotsContainer.innerHTML = '';
    
    slots.forEach(slot => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        slotEl.textContent = slot;
        
        // Check if slot is available (in real app, check against database)
        // For now, randomly disable some slots for demo purposes
        const isAvailable = Math.random() > 0.3;
        
        if (isAvailable) {
            slotEl.addEventListener('click', () => selectTime(slot, slotEl));
        } else {
            slotEl.classList.add('disabled');
        }
        
        slotsContainer.appendChild(slotEl);
    });
}

function generateTimeSlots(dayOfWeek) {
    let hours = BUSINESS_HOURS;
    
    // Check for special hours
    if (BUSINESS_HOURS.specialHours[dayOfWeek]) {
        hours = BUSINESS_HOURS.specialHours[dayOfWeek];
    }
    
    const slots = [];
    const [startHour, startMin] = hours.start.split(':').map(Number);
    const [endHour, endMin] = hours.end.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        slots.push(timeString);
        
        currentMin += BUSINESS_HOURS.slotInterval;
        if (currentMin >= 60) {
            currentHour++;
            currentMin = 0;
        }
    }
    
    return slots;
}

function selectTime(time, element) {
    bookingData.time = time;
    
    // Update visual selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Enable continue button
    document.getElementById('continue-to-details').disabled = false;
}

// ============================================
// SUMMARY
// ============================================
function updateSummary() {
    // Service
    document.getElementById('summary-service').textContent = bookingData.serviceName;
    document.getElementById('summary-price').textContent = `${bookingData.price}€`;
    
    // Date and time
    const dateObj = new Date(bookingData.date + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('es-ES', options);
    document.getElementById('summary-datetime').textContent = 
        `${formattedDate} a las ${bookingData.time}`;
    
    // Contact
    document.getElementById('summary-contact').innerHTML = 
        `${bookingData.name}<br>${bookingData.email}<br>${bookingData.phone}`;
    
    // Notes
    if (bookingData.notes) {
        document.getElementById('summary-notes-section').style.display = 'block';
        document.getElementById('summary-notes').textContent = bookingData.notes;
    } else {
        document.getElementById('summary-notes-section').style.display = 'none';
    }
}

// ============================================
// FORM SUBMISSION
// ============================================
function goWhatsAppFallback() {
  if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER.includes('X')) return;

  const msg = [
    'Hola! Quiero reservar una cita 😊',
    `Servicio: ${bookingData.serviceName || ''} (${bookingData.price || ''}€ / ${bookingData.duration || ''}min)`,
    `Fecha: ${bookingData.date || ''}`,
    `Hora: ${bookingData.time || ''}`,
    `Nombre: ${bookingData.name || ''}`,
    `Email: ${bookingData.email || ''}`,
    `Teléfono: ${bookingData.phone || ''}`,
    bookingData.notes ? `Notas: ${bookingData.notes}` : ''
  ].filter(Boolean).join('\n');

  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const confirmBtn = document.getElementById('confirm-booking');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Procesando...';

    try {
      const res = await fetch(BOOKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: bookingData })
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Booking API error: ${res.status} ${txt}`);
      }

      showSuccess();
    } catch (err) {
      console.error(err);

      // ✅ Si WhatsApp está configurado, NO muestres alerta: redirige directamente
      if (WHATSAPP_NUMBER && !WHATSAPP_NUMBER.includes('X')) {
        goWhatsAppFallback();
        return;
      }

      // Si no hay WhatsApp configurado, entonces sí avisamos
      alert('Ha ocurrido un error. Por favor, inténtalo de nuevo o contáctanos por WhatsApp.');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirmar Reserva';
    }
  });
}

function showSuccess() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Show success message
    const successStep = document.getElementById('step-success');
    successStep.style.display = 'block';
    successStep.classList.add('active');
    
    // Update success details
    document.getElementById('confirm-email').textContent = bookingData.email;
    document.getElementById('final-service').textContent = bookingData.serviceName;
    
    const dateObj = new Date(bookingData.date + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('es-ES', options);
    document.getElementById('final-datetime').textContent = 
        `${formattedDate} a las ${bookingData.time}`;
    
    // Update steps indicator
    document.querySelectorAll('.step').forEach(step => {
        step.classList.add('completed');
        step.classList.remove('active');
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    
    console.log('📅 Booking system loaded');
    console.log('⚠️  Remember to configure:');
    console.log('1. EMAILOCTOPUS_API_KEY in booking.js');
    console.log('2. EMAILOCTOPUS_LIST_ID in booking.js');
    console.log('3. Webhook URL for booking notifications');
});

// Make functions globally available
window.nextStep = nextStep;
window.prevStep = prevStep;