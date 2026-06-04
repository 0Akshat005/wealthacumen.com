document.addEventListener('DOMContentLoaded', () => {
  // =======================================================
  // 1. SPA ROUTING & NAVIGATION
  // =======================================================
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.nav-links li a:not(.dropdown > a)');
  const allViews = document.querySelectorAll('.app-view');
  const header = document.querySelector('.main-nav');
  const navList = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');

  // Handle SPA routing by showing/hiding view containers based on URL hash
  function handleRoute() {
    const hash = window.location.hash || '#home';
    
    // Smooth scroll for landing page anchors if we're on #home
    if (hash.startsWith('#home-section-')) {
      const targetId = hash.replace('#home-section-', '');
      const targetElement = document.getElementById(targetId);
      
      // Ensure we activate the home view first
      activateView('home');
      
      if (targetElement) {
        setTimeout(() => {
          const headerOffset = header.offsetHeight;
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
      return;
    }

    // Service dynamic views routing
    if (hash.startsWith('#service-')) {
      const serviceKey = hash.replace('#service-', '');
      if (serviceDetails[serviceKey]) {
        populateServiceDetail(serviceKey);
        activateView('service-detail');
        window.scrollTo(0, 0);
        return;
      }
    }

    // Intercept E-book route to open modal instead of routing away
    if (hash === '#ebook') {
      openEbookModal();
      // Reset hash back to previous or home
      history.replaceState(null, null, window.location.pathname + (window.location.search || ''));
      handleRoute();
      return;
    }

    // Standard views switching
    const viewName = hash.replace('#', '');
    const validViews = ['home', 'about', 'proprietor', 'faqs', 'diy'];
    
    if (validViews.includes(viewName)) {
      activateView(viewName);
      window.scrollTo(0, 0);
    } else {
      activateView('home');
    }
  }

  // =======================================================
  // 1B. DYNAMIC SERVICE DETAIL CONTENT
  // =======================================================
  const serviceDetails = {
    'equity': {
      title: 'Equity Investment Solutions',
      breadcrumb: 'Equity',
      subtitle: 'Maximize long-term capital growth through stock market participation',
      text: 'Direct equity investing allows you to own shares in publicly traded companies, giving you a stake in their growth and profitability. Historically, equities have outperformed most asset classes over the long term, making them essential for aggressive wealth creation and compounding. At Wealth Acumen, we offer seamless stock trading onboarding and research-backed tools to guide your stock portfolio decisions.',
      benefits: [
        'Potential for high long-term capital appreciation and compounding wealth',
        'Direct equity ownership in leading Indian corporations',
        'Earn dividend income from profitable, well-managed businesses',
        'High liquidity to trade assets during stock market hours',
        'Access to expert technical analysis and cutting-edge trading terminals via Angel One'
      ],
      diyLink: 'https://angel-one.onelink.me/Wjgr/h9fay40r',
      diyTitle: 'Open Trading Account Online',
      diyDesc: 'Access Angel One\'s high-speed trading terminal in minutes'
    },
    'mutual-funds': {
      title: 'Mutual Funds Distribution',
      breadcrumb: 'Mutual Funds',
      subtitle: 'Professional wealth accumulation tailored to your distinct milestones',
      text: 'Mutual Funds pool savings from multiple investors to purchase a diversified portfolio of stocks, bonds, or other securities. Managed by experienced professional fund managers, they offer retail investors a disciplined way to participate in capital markets through Systematic Investment Plans (SIPs) or lump-sum holdings. Wealth Acumen is a registered AMFI Mutual Fund Distributor, guiding you to select plans that align with your risk tolerances.',
      benefits: [
        'Instant diversification across different market caps and economic sectors',
        'Managed by certified, research-backed professional fund managers',
        'Disciplined wealth building through SIPs starting from just ₹500/month',
        'High liquidity with easy redemptions directly back to your bank account',
        'Tax-saving opportunities under Section 80C through ELSS Mutual Funds'
      ],
      diyLink: 'https://angel-one.onelink.me/Wjgr/wcqvcyi6',
      diyTitle: 'Demat-Free MF Investment',
      diyDesc: 'Start investing in mutual funds without opening a Demat depository'
    },
    'insurance': {
      title: 'Comprehensive Insurance Solutions',
      breadcrumb: 'Insurance',
      subtitle: 'Safeguard your family\'s financial future and health',
      text: 'Insurance is the foundation of any financial plan. It protects you and your loved ones from unexpected life events, medical emergencies, and accidents. By securing appropriate risk coverage, you ensure that your investments and wealth creation plans remain safe and uninterrupted even during testing times.',
      benefits: [
        'Secure term life coverage to protect your family\'s standard of living',
        'Robust health policies to cover escalating hospitalization and medical bills',
        'Protect your business and personal assets with general insurance policies',
        'Optional critical illness riders to offset income loss during recovery',
        'Expert guidance in claims settlement, ensuring support when you need it most'
      ],
      diyLink: '#home-section-contact',
      diyTitle: 'Request Insurance Advice',
      diyDesc: 'Let us customize a risk protection policy for your family'
    },
    'etfs': {
      title: 'Exchange Traded Funds (ETFs)',
      breadcrumb: 'ETFs',
      subtitle: 'Low-cost index investing with the flexibility of equity trading',
      text: 'ETFs track specific market indices (like Nifty 50, Sensex, or Gold) and trade on stock exchanges like regular shares. They offer passive investment strategies, combining the diversification of mutual funds with the real-time trading flexibility and liquidity of equities. They represent an excellent tool for asset allocation at lower expense ratios.',
      benefits: [
        'Very low expense ratios compared to actively managed mutual funds',
        'Buy and sell units in real-time during stock market hours at market price',
        'Instant exposure to an entire basket of stocks or commodities with one transaction',
        'High transparency, mirroring actual index constituents and weights',
        'Ideal for building long-term passive index portfolios'
      ],
      diyLink: 'https://angel-one.onelink.me/Wjgr/h9fay40r',
      diyTitle: 'Open Trading Account Online',
      diyDesc: 'Start buying index ETFs in a few simple clicks'
    },
    'bonds': {
      title: 'Bonds & Fixed Income Securities',
      breadcrumb: 'Bonds',
      subtitle: 'Capital preservation and stable income via debt instruments',
      text: 'Bonds are debt securities issued by governments, public sector undertakings, and major corporations to raise capital. Investing in fixed-income bonds provides regular interest payouts (coupons) and return of your principal amount upon maturity, offering a shield against stock market volatility and securing predictable cashflows.',
      benefits: [
        'Predictable, regular income stream through fixed coupon payouts',
        'Lower risk profile compared to volatile equity investments',
        'Preserves capital while yielding returns higher than basic savings rates',
        'Excellent tool for asset allocation and portfolio diversification',
        'Choose from highly-rated corporate debt, sovereign gold bonds, or government papers'
      ],
      diyLink: '#home-section-contact',
      diyTitle: 'Consult on Fixed Income',
      diyDesc: 'Schedule a call to discuss secure bond options'
    },
    'fixed-deposit': {
      title: 'Fixed Deposits (FDs)',
      breadcrumb: 'Fixed Deposit',
      subtitle: 'Secure capital accumulation with guaranteed return rates',
      text: 'Fixed Deposits are debt instruments offered by leading banks and corporate houses that lock in your savings at a guaranteed interest rate for a specific tenure. FDs offer the absolute highest level of capital security, making them ideal for short-term goals, emergency funds, and conservative investors who value stability over market risk.',
      benefits: [
        'Guaranteed interest returns unaffected by market drops or interest rate hikes',
        'High credit ratings from agencies for corporate FDs, ensuring security',
        'Flexible lock-in options ranging from 7 days up to 10 years',
        'Select monthly, quarterly, or cumulative interest payout systems',
        'Easy premature withdrawal options to cover sudden cash requirements'
      ],
      diyLink: '#home-section-contact',
      diyTitle: 'Compare Fixed Deposit Rates',
      diyDesc: 'Contact us to lock in the highest FD rates today'
    }
  };

  function populateServiceDetail(key) {
    const data = serviceDetails[key];
    if (!data) return;

    document.getElementById('serviceDetailTitle').textContent = data.title;
    document.getElementById('serviceDetailBreadcrumb').textContent = data.breadcrumb;
    document.getElementById('serviceDetailSubtitle').textContent = data.subtitle;
    document.getElementById('serviceDetailText').textContent = data.text;

    // Populate benefits list
    const benefitsList = document.getElementById('serviceDetailBenefits');
    benefitsList.innerHTML = '';
    data.benefits.forEach(benefit => {
      const li = document.createElement('li');
      li.style.position = 'relative';
      li.style.paddingLeft = '25px';
      li.style.marginBottom = '12px';
      li.style.fontSize = '15px';
      
      // Inline visual style checkmark
      const checkSpan = document.createElement('span');
      checkSpan.innerHTML = '✓ ';
      checkSpan.style.color = 'var(--accent-color)';
      checkSpan.style.fontWeight = 'bold';
      checkSpan.style.position = 'absolute';
      checkSpan.style.left = '0';
      
      li.appendChild(checkSpan);
      li.appendChild(document.createTextNode(benefit));
      benefitsList.appendChild(li);
    });

    // Populate DIY links
    const diyLinkBtn = document.getElementById('serviceDetailDiyLink');
    const diyTitle = document.getElementById('serviceDetailDiyTitle');
    const diyDesc = document.getElementById('serviceDetailDiyDesc');

    diyLinkBtn.setAttribute('href', data.diyLink);
    // If it's a contact target, set scroll spy redirect behaviour
    if (data.diyLink.startsWith('#')) {
      diyLinkBtn.removeAttribute('target');
      diyLinkBtn.removeAttribute('rel');
      diyLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#home-section-contact';
      });
    } else {
      diyLinkBtn.setAttribute('target', '_blank');
      diyLinkBtn.setAttribute('rel', 'noopener');
    }

    diyTitle.textContent = data.diyTitle;
    diyDesc.textContent = data.diyDesc;
  }

  function activateView(viewId) {
    allViews.forEach(view => {
      if (view.id === `${viewId}-view`) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    // Update active nav highlights
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    
    const activeLink = document.querySelector(`.nav-links a[href="#${viewId}"]`) || 
                       document.querySelector(`.nav-links a[href*="#home-section-"]`);
    if (activeLink) {
      // Find parent top-level list item
      let parentLi = activeLink.closest('.nav-links > li');
      if (parentLi) parentLi.classList.add('active');
    }
  }

  window.addEventListener('hashchange', handleRoute);
  // Run routing on initial load
  handleRoute();

  // Scroll Spy for Home Section links
  window.addEventListener('scroll', () => {
    // 1. Sticky Header
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // 2. Active Anchor highlighting during scroll (only if home view is active)
    const homeView = document.getElementById('home-view');
    if (homeView && homeView.classList.contains('active-view')) {
      const scrollPosition = window.scrollY + header.offsetHeight + 100;
      const sections = ['why-choose-us', 'services', 'best-features', 'testimonials', 'compounding', 'videos', 'blogs', 'contact'];
      
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            document.querySelectorAll('.nav-links > li').forEach(li => li.classList.remove('active'));
            const link = document.querySelector(`.nav-links a[href="#home-section-${sectionId}"]`);
            if (link) {
              const parentLi = link.closest('.nav-links > li');
              if (parentLi) parentLi.classList.add('active');
            }
            break;
          }
        }
      }
    }
  });

  // =======================================================
  // 2. MOBILE MENU & ACCORDIONS
  // =======================================================
  // Hamburger toggle
  menuToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    const isExpanded = navList.classList.contains('active');
    menuToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close menu drawer on clicking regular link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Mobile Accordion support for dropdowns in sidebar
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const anchor = dropdown.querySelector('a');
    anchor.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });

  // =======================================================
  // 3. STATS CHART (Indian Investor Growth)
  // =======================================================
  const statsChartCanvas = document.getElementById('statsChart');
  if (statsChartCanvas) {
    const ctx = statsChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025 (E)'],
        datasets: [{
          label: 'Total Demat Accounts in India (Millions)',
          data: [40.8, 55.1, 89.7, 114.5, 154.0, 182.0],
          backgroundColor: 'rgba(10, 31, 68, 0.85)',
          borderColor: '#0A1F44',
          borderWidth: 1,
          hoverBackgroundColor: '#D4A017',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0A1F44',
            titleFont: { family: 'Poppins' },
            bodyFont: { family: 'Open Sans' },
            callbacks: {
              label: function(context) {
                return ` ${context.raw} Million Accounts`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: { family: 'Open Sans' }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { family: 'Poppins', weight: 600 }
            }
          }
        }
      }
    });
  }

  // =======================================================
  // 4. TESTIMONIALS SLIDER
  // =======================================================
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        }
      }
    });
  }

  // =======================================================
  // 5. INTERACTIVE SIP CALCULATOR & CHART.JS compounding
  // =======================================================
  const rangeAmount = document.getElementById('sipAmount');
  const rangeRate = document.getElementById('sipRate');
  const rangeYears = document.getElementById('sipYears');
  
  const textAmount = document.getElementById('sipAmountValue');
  const textRate = document.getElementById('sipRateValue');
  const textYears = document.getElementById('sipYearsValue');

  const resultInvested = document.getElementById('resultInvested');
  const resultGained = document.getElementById('resultGained');
  const resultTotalValue = document.getElementById('resultTotalValue');
  
  const sipChartCanvas = document.getElementById('sipChart');
  let sipChart = null;

  function formatCurrency(val) {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }

  function updateSIPCalculator() {
    const monthlyInvestment = parseFloat(rangeAmount.value);
    const annualReturnRate = parseFloat(rangeRate.value);
    const tenureYears = parseInt(rangeYears.value);

    // Update Slider text
    textAmount.textContent = monthlyInvestment.toLocaleString('en-IN');
    textRate.textContent = annualReturnRate + '%';
    textYears.textContent = tenureYears + ' Years';

    // Compounding math:
    // SIP Compound Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    // where P = monthly investment, i = annual return rate / 12 / 100, n = tenure in months
    const i = annualReturnRate / 12 / 100;
    const n = tenureYears * 12;
    
    const totalInvested = monthlyInvestment * n;
    let totalValue = 0;
    
    if (i === 0) {
      totalValue = totalInvested;
    } else {
      totalValue = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }
    
    const wealthGained = Math.max(0, totalValue - totalInvested);

    // Update results display
    resultInvested.textContent = formatCurrency(totalInvested);
    resultGained.textContent = formatCurrency(wealthGained);
    resultTotalValue.textContent = formatCurrency(totalValue);

    // Update Chart.js Doughnut
    updateSipChart(totalInvested, wealthGained);
  }

  function updateSipChart(invested, gained) {
    if (!sipChartCanvas) return;

    if (sipChart) {
      sipChart.data.datasets[0].data = [invested, gained];
      sipChart.update();
    } else {
      const ctx = sipChartCanvas.getContext('2d');
      sipChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Investment', 'Est. Returns'],
          datasets: [{
            data: [invested, gained],
            backgroundColor: ['#0A1F44', '#D4A017'],
            borderColor: ['#0A1F44', '#D4A017'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Open Sans', size: 12 },
                color: '#222222'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ${context.label}: ${formatCurrency(context.raw)}`;
                }
              }
            }
          }
        }
      });
    }
  }

  if (rangeAmount && rangeRate && rangeYears) {
    // Add input listeners
    rangeAmount.addEventListener('input', updateSIPCalculator);
    rangeRate.addEventListener('input', updateSIPCalculator);
    rangeYears.addEventListener('input', updateSIPCalculator);
    
    // Initial draw
    updateSIPCalculator();
  }

  // =======================================================
  // 6. FAQs ACCORDION TOGGLE
  // =======================================================
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // =======================================================
  // 7. REQUEST CALLBACK FORM HANDLER
  // =======================================================
  const contactForm = document.getElementById('callbackForm');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const successMessage = document.getElementById('successMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const topicOption = document.querySelector('input[name="discussTopic"]:checked');
      const topic = topicOption ? topicOption.value : 'Investment';

      if (!fullName || !email || !phone) {
        alert('Please fill out all required fields.');
        return;
      }

      // Display custom styled success modal
      if (successModal && successMessage) {
        successMessage.innerHTML = `Thank you <strong>${fullName}</strong>! Your request to discuss <strong>${topic}</strong> has been received. Our wealth advisory team will contact you shortly at <strong>${phone}</strong> or <strong>${email}</strong>.`;
        successModal.classList.add('active');
        
        // Reset the form
        contactForm.reset();
      }
    });
  }

  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
    // Close modal when clicking on dark overlay
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  // =======================================================
  // 8. E-BOOK LEAD CAPTURE MODAL LOGIC
  // =======================================================
  const ebookModal = document.getElementById('ebookModal');
  const ebookModalCloseBtn = document.getElementById('ebookModalCloseBtn');
  const ebookForm = document.getElementById('ebookForm');
  const ebookSuccessContent = document.getElementById('ebookSuccessContent');
  const ebookModalMainBody = document.getElementById('ebookModalMainBody');

  function openEbookModal() {
    if (ebookModal) {
      // Reset state first
      if (ebookSuccessContent) ebookSuccessContent.style.display = 'none';
      if (ebookModalMainBody) ebookModalMainBody.style.display = 'grid';
      if (ebookForm) ebookForm.reset();
      ebookModal.classList.add('active');
    }
  }

  if (ebookModalCloseBtn && ebookModal) {
    ebookModalCloseBtn.addEventListener('click', () => {
      ebookModal.classList.remove('active');
    });
    
    // Close modal when clicking on dark overlay
    ebookModal.addEventListener('click', (e) => {
      if (e.target === ebookModal) {
        ebookModal.classList.remove('active');
      }
    });
  }

  if (ebookForm) {
    ebookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('ebookName').value.trim();
      const email = document.getElementById('ebookEmail').value.trim();
      const phone = document.getElementById('ebookPhone').value.trim();

      if (name && email && phone) {
        // Show success and PDF download link
        if (ebookModalMainBody) ebookModalMainBody.style.display = 'none';
        if (ebookSuccessContent) ebookSuccessContent.style.display = 'block';
      }
    });
  }

  // =======================================================
  // 9. DYNAMIC VIDEO PLAYER LOADER
  // =======================================================
  const videoWrappers = document.querySelectorAll('.video-wrapper[data-video-id]');
  videoWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', function() {
      const videoId = this.getAttribute('data-video-id');
      const thumbnail = this.querySelector('.video-thumbnail');
      if (videoId) {
        this.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="${thumbnail ? thumbnail.alt : 'Video Player'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border: 0; width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></iframe>`;
      }
    });
  });

  // =======================================================
  // 10. MARKET INSIGHTS SLIDER (OFFICIAL GRAPHS)
  // =======================================================
  if (typeof Swiper !== 'undefined' && document.querySelector('.insights-slider')) {
    new Swiper('.insights-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.insights-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        }
      }
    });
  }

  // =======================================================
  // 11. 3D TILT EFFECT ON MOUSEMOVE
  // =======================================================
  const tiltWrappers = document.querySelectorAll('.tilt-wrapper');
  tiltWrappers.forEach(wrapper => {
    const tiltElement = wrapper.querySelector('.tilt-element');
    if (!tiltElement) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = ((y - centerY) / centerY) * -15;
      const tiltY = ((x - centerX) / centerX) * 15;
      
      tiltElement.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      tiltElement.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth - e.pageX * 2) / 80;
      const y = (window.innerHeight - e.pageY * 2) / 80;
      heroSection.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroSection.style.backgroundPosition = '50% 50%';
    });
  }
});

