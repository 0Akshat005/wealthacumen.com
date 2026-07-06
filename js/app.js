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

  // =======================================================
  // HERO BANNER SIGNATURE VISUALIZER ANIMATIONS
  // =======================================================
  const floatingCard = document.getElementById('floatingGlassCard');
  if (floatingCard) {
    floatingCard.addEventListener('click', (e) => {
      e.preventDefault();
      const targetElement = document.getElementById('compounding');
      if (targetElement) {
        const headerOffset = document.querySelector('.main-nav').offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  const heroCountUp = document.getElementById('heroCountUp');
  // Force chart area and label visible after curve draw completes (1.5s + 0.3s delay = 1.8s)
  setTimeout(() => {
    const heroArea = document.getElementById('heroArea');
    const finalValueLabel = document.getElementById('finalValueLabel');
    if (heroArea) heroArea.style.opacity = '1';
    if (finalValueLabel) finalValueLabel.style.opacity = '1';
  }, 1800);

  if (heroCountUp && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let startTimestamp = null;
    const duration = 1200;
    const startValue = 0;
    const endValue = 50457550;
    
    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * (endValue - startValue) + startValue);
      heroCountUp.textContent = '\u20B9' + currentValue.toLocaleString('en-IN');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        heroCountUp.textContent = '\u20B95,04,57,550'; // specific non-rounded per brief
      }
    }
    window.requestAnimationFrame(step);
  } else if (heroCountUp) {
    heroCountUp.textContent = '\u20B95,04,57,550';
  }


  // =======================================================
  // HERO CHART PANEL PARALLAX TILT
  // Per brief Section 10: mouse parallax on pointer devices only
  // =======================================================
  const chartPanel = document.getElementById('hero-chart-panel');
  const heroSection = document.getElementById('hero');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (chartPanel && heroSection && !prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to +1
      const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to +1
      const maxTilt = 3.5; // degrees — subtle, per brief
      chartPanel.style.transform = `perspective(800px) rotateY(${dx * maxTilt}deg) rotateX(${-dy * maxTilt}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      chartPanel.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // =======================================================
  // HERO ENTRANCE CHOREOGRAPHY (JS-driven, bulletproof)
  // Per brief Section 10: staggered sequence
  // eyebrow → headline → subhead → ticker → delay → CTA → microcopy
  // =======================================================
  const heroContent = document.getElementById('hero-content');
  const heroChart = document.querySelector('.hero-chart-column');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroContent && !reducedMotion) {
    const heroItems = Array.from(heroContent.children);
    const delays = [0, 150, 280, 420, 560, 700, 860]; // ms

    heroItems.forEach(el => {
      el.classList.add('hero-reveal-item');
    });

    if (heroChart) {
      heroChart.classList.add('hero-reveal-item');
    }

    requestAnimationFrame(() => {
      heroItems.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('revealed');
        }, delays[i] || i * 120);
      });
      if (heroChart) {
        setTimeout(() => heroChart.classList.add('revealed'), 300);
      }
    });
  }

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
    const validViews = ['home', 'about', 'proprietor', 'faqs', 'diy', 'contact'];
    
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
      diyLink: '#contact',
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
      diyLink: '#contact',
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
      diyLink: '#contact',
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
        window.location.hash = '#contact';
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
          backgroundColor: 'rgba(192, 138, 46, 0.85)',
          borderColor: '#C08A2E',
          borderWidth: 1,
          hoverBackgroundColor: '#E2B35B',
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
            backgroundColor: '#16294D',
            titleFont: { family: 'IBM Plex Sans', weight: '600' },
            bodyFont: { family: 'IBM Plex Sans' },
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
              color: 'rgba(255, 255, 255, 0.08)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: { family: 'IBM Plex Mono', size: 11 }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: { family: 'IBM Plex Sans', weight: 600 }
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
          labels: ['Total Invested', 'Wealth Gained'],
          datasets: [{
            data: [invested, gained],
            backgroundColor: ['#0E7C66', '#C08A2E'],
            borderColor: ['#0E7C66', '#C08A2E'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'IBM Plex Sans', size: 12, weight: 500 },
                color: '#10151F',
                padding: 15
              }
            },
            tooltip: {
              backgroundColor: '#16294D',
              titleFont: { family: 'IBM Plex Sans' },
              bodyFont: { family: 'IBM Plex Sans' },
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

  // =======================================================
  // HERO PARTICLES INTERACTIVE SIMULATION
  // =======================================================
  const canvas = document.getElementById('hero-particles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 40;
    const maxConnectionDistance = 120;
    let mouse = { x: null, y: null, radius: 150 };

    // Track mouse coordinates on hero hover
    const parentHero = canvas.parentElement;
    parentHero.addEventListener('mousemove', (e) => {
      const rect = parentHero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    parentHero.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resizeCanvas() {
      canvas.width = parentHero.offsetWidth;
      canvas.height = parentHero.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Object Definition
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2.5 + 1.5;
        this.color = Math.random() > 0.5 ? 'rgba(192, 138, 46, 0.4)' : 'rgba(14, 124, 102, 0.4)'; // Gold or Teal
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connect() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxConnectionDistance) {
            const opacity = (1 - distance / maxConnectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(192, 138, 46, ${opacity})`; // Compounding Gold wireframes
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }

        // Connect to mouse pointer
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particlesArray[a].x - mouse.x;
          const dy = particlesArray[a].y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const opacity = (1 - distance / mouse.radius) * 0.25;
            ctx.strokeStyle = `rgba(14, 124, 102, ${opacity})`; // Interactive Growth Teal lines
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
      requestAnimationFrame(animate);
    }

    init();
    animate();
  }


  // =======================================================
  // REAL-TIME OPPORTUNITY COST TICKER
  // Per brief Section 8: 2dp, odometer-style, assumption always visible
  // Updates BOTH the slim header strip AND the large hero display
  // =======================================================
  const tickerSlim   = document.getElementById('ticking-wealth-lost');    // slim header
  const tickerHero   = document.getElementById('hero-ticker-display');    // hero block

  if (tickerSlim || tickerHero) {
    const pageOpenTime = Date.now();
    // Math: ₹1,00,000/mo SIP, 12% p.a. compounded monthly over 15y
    // Future Value = ₹5,04,57,550. Marginal gain per second:
    // dFV/dt = FV * ln(1 + r_monthly) ≈ 5,04,57,550 * (0.12/12) / (12*15) months
    // Simplified: per-second growth on the outstanding SIP corpus
    // Using: ~₹2,163,840/year marginal benefit = ₹0.06858 per second (10x faster)
    const gainPerMs = 0.06858 / 1000;

    let prevDisplayVal = '0.00';

    function updateTicker() {
      const elapsedMs = Date.now() - pageOpenTime;
      const totalGained = elapsedMs * gainPerMs;
      const display = '\u20B9' + totalGained.toFixed(2);

      if (tickerSlim)  tickerSlim.textContent  = display;
      if (tickerHero)  tickerHero.textContent   = display;
    }

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Still show, just don't animate rolling — update at 1s intervals
      setInterval(updateTicker, 1000);
    } else {
      // ~10 updates/second for smooth odometer feel (not jarring)
      setInterval(updateTicker, 100);
    }

    updateTicker(); // immediate first draw
  }

  // =======================================================
  // INTERACTIVE ASSET EXPLORER TAB SWITCHING
  // =======================================================
  const explorerData = {
    'equity': {
      eyebrow: '⚡ Compound Potential: High',
      title: 'Equity Investment Solutions',
      bestFor: 'Best for: Hands-on investors comfortable with volatility',
      text: 'Maximize long-term capital growth through direct stock market participation. Direct equity investing allows you to own shares in leading corporations, capturing compounding dividends and price appreciation. Access institutional trading terminals and real-time charting via Angel One.',
      riskWidth: '85%',
      riskColor: 'var(--wa-rust-orange)',
      riskValue: 'High (85%)',
      returnWidth: '80%',
      returnColor: 'var(--wa-growth-teal)',
      returnValue: '5+ Years',
      learnLink: '#service-equity',
      diyLink: 'https://angel-one.onelink.me/Wjgr/h9fay40r'
    },
    'mutual-funds': {
      eyebrow: '📈 Compounding Potential: High',
      title: 'Mutual Funds Distribution',
      bestFor: 'Best for: Long-term, disciplined goal-building',
      text: 'Achieve disciplined wealth generation through diversified, professionally managed mutual fund portfolios. Pool savings with other investors to own a basket of stocks, bonds, or gold, matching your financial goals and risk capabilities.',
      riskWidth: '60%',
      riskColor: 'var(--wa-compounding-gold)',
      riskValue: 'Moderate (60%)',
      returnWidth: '85%',
      returnColor: 'var(--wa-growth-teal)',
      returnValue: '5+ Years',
      learnLink: '#service-mutual-funds',
      diyLink: 'https://angel-one.onelink.me/Wjgr/wcqvcyi6'
    },
    'etfs': {
      eyebrow: '📊 Cost Efficiency: High',
      title: 'Exchange Traded Funds (ETFs)',
      bestFor: 'Best for: Low-cost, diversified market exposure',
      text: 'Gain broad market exposure with highly liquid, cost-effective ETFs. Mirror index performance (like Nifty 50 or Gold) at low expense ratios with the real-time liquidity of trading on stock exchanges.',
      riskWidth: '55%',
      riskColor: 'var(--wa-compounding-gold)',
      riskValue: 'Moderate (55%)',
      returnWidth: '70%',
      returnColor: 'var(--wa-growth-teal)',
      returnValue: '3+ Years',
      learnLink: '#service-etfs',
      diyLink: 'https://angel-one.onelink.me/Wjgr/h9fay40r'
    },
    'bonds': {
      eyebrow: '🛡️ Capital Protection: Stable',
      title: 'Bonds & Debt Securities',
      bestFor: 'Best for: Capital preservation with steady income',
      text: 'Preserve capital and secure predictable income streams with top-rated corporate, PSU, and government bonds. Shield your portfolio from stock market volatility with steady interest payouts.',
      riskWidth: '35%',
      riskColor: 'var(--wa-growth-teal)',
      riskValue: 'Low–Moderate (35%)',
      returnWidth: '50%',
      returnColor: 'var(--wa-growth-teal)',
      returnValue: '1–5 Years',
      learnLink: '#service-bonds',
      diyLink: '#contact'
    },
    'fixed-deposit': {
      eyebrow: '🔒 Capital Security: Guaranteed',
      title: 'Fixed Deposits (FDs)',
      bestFor: 'Best for: Guaranteed, risk-free returns',
      text: 'Earn fixed, guaranteed returns from India\'s top-rated financial institutions. Lock in your funds at a stable interest rate unaffected by macro market volatility.',
      riskWidth: '15%',
      riskColor: 'var(--wa-growth-teal)',
      riskValue: 'Low (15%)',
      returnWidth: '40%',
      returnColor: 'var(--wa-growth-teal)',
      returnValue: 'Flexible Horizon',
      learnLink: '#service-fixed-deposit',
      diyLink: '#contact'
    },
    'insurance': {
      eyebrow: '⛱️ Risk Management: High',
      title: 'Comprehensive Insurance Policies',
      bestFor: 'Best for: Protecting the plan, not growing it',
      text: 'Secure your family\'s financial future and health with term life and medical insurance. Build a robust cushion to protect your long-term compounding investments during emergency life events.',
      riskWidth: '10%',
      riskColor: 'var(--wa-growth-teal)',
      riskValue: 'Minimal (10%)',
      returnWidth: '95%',
      returnColor: 'var(--wa-growth-teal)',
      returnValue: 'Long-term (10+ Years)',
      learnLink: '#service-insurance',
      diyLink: '#contact'
    }
  };

  const assetTabs = document.querySelectorAll('.asset-tab');
  const dashboardCard = document.getElementById('asset-dashboard');
  
  if (dashboardCard && assetTabs.length > 0) {
    const dashEyebrow = document.getElementById('dash-eyebrow');
    const dashTitle = document.getElementById('dash-title');
    const dashBestFor = document.getElementById('dash-best-for');
    const dashText = document.getElementById('dash-text');
    const dashRiskBar = document.getElementById('dash-risk-bar');
    const dashRiskVal = document.getElementById('dash-risk-value');
    const dashReturnBar = document.getElementById('dash-return-bar');
    const dashReturnVal = document.getElementById('dash-return-value');
    const dashLearnBtn = document.getElementById('dash-learn-btn');
    const dashDiyBtn = document.getElementById('dash-diy-btn');

    assetTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const assetKey = tab.getAttribute('data-asset');
        const data = explorerData[assetKey];
        if (!data) return;

        // Active tab switch
        assetTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Fade morphing animation
        dashboardCard.classList.add('workspace-fade-out');
        setTimeout(() => {
          dashEyebrow.textContent = data.eyebrow;
          dashTitle.textContent = data.title;
          dashBestFor.textContent = data.bestFor;
          dashText.textContent = data.text;
          
          dashRiskBar.style.width = data.riskWidth;
          dashRiskBar.style.backgroundColor = data.riskColor;
          dashRiskVal.textContent = data.riskValue;

          dashReturnBar.style.width = data.returnWidth;
          dashReturnBar.style.backgroundColor = data.returnColor;
          dashReturnVal.textContent = data.returnValue;

          dashLearnBtn.setAttribute('href', data.learnLink);
          dashDiyBtn.setAttribute('href', data.diyLink);

          // Change button styling based on whether it is direct link or modal callback
          if (data.diyLink.startsWith('#')) {
            dashDiyBtn.textContent = 'Request Advice Consultation';
            dashDiyBtn.className = 'btn btn-secondary';
          } else {
            dashDiyBtn.innerHTML = 'Start Online Account <i class="fas fa-chevron-right" style="margin-left: 8px;"></i>';
            dashDiyBtn.className = 'btn btn-primary';
          }

          dashboardCard.classList.remove('workspace-fade-out');
        }, 200);
      });
    });
  }

  // =======================================================
  // GROWW-INSPIRED EXPLORER MOCK SEARCH
  // =======================================================
  const searchInput = document.getElementById('fund-search-input');
  const searchSuggestions = document.getElementById('search-suggestions');
  const searchClear = document.getElementById('search-clear-btn');
  const searchResultsBox = document.getElementById('search-results-box');
  const suggestionTagsSec = document.querySelector('.suggestions-section');

  const searchableAssets = [
    { name: 'Nippon India Large Cap Fund', type: 'Mutual Fund', targetAsset: 'mutual-funds' },
    { name: 'Parag Parikh Flexi Cap Fund', type: 'Mutual Fund', targetAsset: 'mutual-funds' },
    { name: 'SBI Small Cap Fund Growth', type: 'Mutual Fund', targetAsset: 'mutual-funds' },
    { name: 'HDFC Mid-Cap Opportunities Fund', type: 'Mutual Fund', targetAsset: 'mutual-funds' },
    { name: 'Angel One Demat & Trading Account', type: 'Equity', targetAsset: 'equity' },
    { name: 'Gold BeES ETF Exchange Traded', type: 'ETF', targetAsset: 'etfs' },
    { name: 'Sovereign Gold Bonds Series', type: 'Bond', targetAsset: 'bonds' },
    { name: 'ICICI Prudential Nifty 50 ETF', type: 'ETF', targetAsset: 'etfs' },
    { name: 'HDFC Tax Saver ELSS Mutual Fund', type: 'Mutual Fund', targetAsset: 'mutual-funds' },
    { name: 'SBI Corporate Fixed Deposit', type: 'Fixed Deposit', targetAsset: 'fixed-deposit' },
    { name: 'Term Insurance Security Cover', type: 'Insurance', targetAsset: 'insurance' }
  ];

  if (searchInput && searchSuggestions) {
    // Show suggestions on focus
    searchInput.addEventListener('focus', () => {
      searchSuggestions.style.display = 'block';
    });

    // Close suggestions on click outside (with short delay for clicks inside)
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.style.display = 'none';
      }
    });

    // Suggestions Click
    const tags = document.querySelectorAll('.suggestion-tag');
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        const query = tag.getAttribute('data-search');
        searchInput.value = query;
        searchClear.style.display = 'block';
        triggerTabForSearch(query);
        searchSuggestions.style.display = 'none';
      });
    });

    // Clear Button Click
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchResultsBox.style.display = 'none';
        suggestionTagsSec.style.display = 'block';
        searchInput.focus();
      });
    }

    // Input matching filter
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length > 0) {
        searchClear.style.display = 'block';
        suggestionTagsSec.style.display = 'none';
        
        // Match items
        const matches = searchableAssets.filter(item => 
          item.name.toLowerCase().includes(query) || item.type.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
          searchResultsBox.innerHTML = '';
          matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'search-match-item';
            div.innerHTML = `
              <div class="match-info">
                <h5>${match.name}</h5>
                <span>${match.type} • Official Broker / MFD Channel</span>
              </div>
              <div class="match-action">Analyze Tab <i class="fas fa-arrow-right" style="margin-left: 5px;"></i></div>
            `;
            
            div.addEventListener('click', () => {
              searchInput.value = match.name;
              // Trigger tab click
              const targetTab = document.querySelector(`.asset-tab[data-asset="${match.targetAsset}"]`);
              if (targetTab) {
                targetTab.click();
                // Smooth scroll to workspace
                const workspaceTop = document.querySelector('.asset-explorer-workspace').getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top: workspaceTop, behavior: 'smooth' });
              }
              searchSuggestions.style.display = 'none';
            });
            
            searchResultsBox.appendChild(div);
          });
          searchResultsBox.style.display = 'flex';
        } else {
          searchResultsBox.innerHTML = `
            <div style="padding: 15px 0; text-align: center; color: var(--wa-slate); font-size: 13.5px;">
              <i class="fas fa-search-minus" style="margin-right: 5px;"></i> No matches found. Try searching "Nippon", "Gold", or "Demat".
            </div>
          `;
          searchResultsBox.style.display = 'block';
        }
      } else {
        searchClear.style.display = 'none';
        searchResultsBox.style.display = 'none';
        suggestionTagsSec.style.display = 'block';
      }
    });
  }

  function triggerTabForSearch(query) {
    let matchedAsset = 'mutual-funds';
    const q = query.toLowerCase();
    
    if (q.includes('large cap') || q.includes('flexi cap') || q.includes('small cap') || q.includes('mid-cap') || q.includes('mutual')) {
      matchedAsset = 'mutual-funds';
    } else if (q.includes('gold') || q.includes('bees') || q.includes('etf') || q.includes('nifty 50')) {
      matchedAsset = 'etfs';
    } else if (q.includes('demat') || q.includes('trading') || q.includes('equity') || q.includes('stock')) {
      matchedAsset = 'equity';
    }

    const targetTab = document.querySelector(`.asset-tab[data-asset="${matchedAsset}"]`);
    if (targetTab) {
      targetTab.click();
      const workspaceTop = document.querySelector('.asset-explorer-workspace').getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: workspaceTop, behavior: 'smooth' });
    }
  }

  // =======================================================
  // EDITORIAL TESTIMONIALS SPOTLIGHT ROTATION
  // Per brief Section 7: slow, editorial pull-quote cycling
  // All testimonial text verbatim — content frozen per brief
  // =======================================================
  const testimonials = [
    {
      text: "My sincere thanks to Mr. Atharva of Wealth Acumen for providing the knowledge of stock market in a very simple but clear ways by using different charts and different methods. Your knowledge and clear explanations have significantly enhanced my understanding of the subject.",
      attribution: "Manisha Kahate \u2014 Senior Lecturer"
    },
    {
      text: "Wealth Acumen helped me understand how knowledge and psychology play a key role in investing. I applied what I learned and have already started seeing positive results. Atharva\u2019s guidance makes complex investment products simple to understand.",
      attribution: "Rupesh Gupta \u2014 IT Professional"
    },
    {
      text: "Mr. Atharva is a trustworthy advisor who provides investment guidance based on individual needs. He also helped me recover an old frozen demat account with another broker, where I had lost hope of getting my money back. I\u2019m truly happy with his support and work.",
      attribution: "Nandita Tamhane \u2014 Govt Employee"
    },
    {
      text: "It is very nice experience and journey of investment and trading with you since last 2 years. Learned a lot with basics in trading and then via systematic investment plan with SIP. Your knowhow and experience worked for all of us in our family.",
      attribution: "Shekhar Jogwar \u2014 Engineer"
    }
  ];

  const testimonialText = document.getElementById('testimonial-text');
  const testimonialAttrib = document.getElementById('testimonial-attribution');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');

  if (testimonialText && testimonialAttrib && testimonialDots.length) {
    let currentIndex = 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function showTestimonial(index) {
      if (prefersReduced) {
        testimonialText.textContent = testimonials[index].text;
        testimonialAttrib.textContent = testimonials[index].attribution;
      } else {
        testimonialText.style.opacity = '0';
        testimonialAttrib.style.opacity = '0';
        setTimeout(() => {
          testimonialText.textContent = testimonials[index].text;
          testimonialAttrib.textContent = testimonials[index].attribution;
          testimonialText.style.transition = 'opacity 0.5s ease';
          testimonialAttrib.style.transition = 'opacity 0.5s ease';
          testimonialText.style.opacity = '1';
          testimonialAttrib.style.opacity = '1';
        }, 300);
      }

      testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    // Dot click navigation
    testimonialDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        showTestimonial(idx);
      });
    });

    // Auto-cycle every 6 seconds — slow editorial pace
    if (!prefersReduced) {
      setInterval(() => {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
      }, 6000);
    }
  }

});



