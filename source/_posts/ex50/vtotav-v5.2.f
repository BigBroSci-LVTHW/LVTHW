      PROGRAM VTOTAV
      PARAMETER(NGXM=256,NOUTM=1024)
      CHARACTER*80 HEADER
      DIMENSION VLOCAL(NGXM*NGXM*NGXM),VAV(NOUTM)
      I=0

      WRITE(*,*) 'Which direction to keep? (1-3 --- 1=X,2=Y,3=Z)'
      READ(*,*) IDIR
      IDIR=MOD(IDIR+20,3)+1
      OPEN(20,FILE='LOCPOT',STATUS='OLD',ERR=1000)
C      READ(20,*,ERR=1000,END=1000) NIONS,IDUM1,IDUM2
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      I=0; II=0; III=0; IIII=0
      READ(HEADER,*,ERR=12,END=12) I,II,III,IIII
12    NIONS=I+II+III+IIII
C     READ(20,*,ERR=1000,END=1000) NIONS
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      WRITE(*,*) NIONS
      DO 10 I=1,NIONS
         READ(20,*,ERR=1000,END=1000) RDUM1,RDUM2,RDUM3
   10 CONTINUE
      WRITE(*,*) 'positions read'
      READ(20,'(A)',ERR=1000,END=1000) HEADER
      READ(20,*,ERR=1000,END=1000) NGX,NGY,NGZ
      NPLWV=NGX*NGY*NGZ
      IF (IDIR.EQ.1) NOUT=NGX
      IF (IDIR.EQ.2) NOUT=NGY
      IF (IDIR.EQ.3) NOUT=NGZ
      IF (NPLWV.GT.(NGXM*NGXM*NGXM)) THEN
         WRITE(*,*) 'NPLWV .GT. NGXM**3 (',NPLWV,').'
         STOP
      ENDIF
      IF (NOUT.GT.NOUTM) THEN
         WRITE(*,*) 'NOUT .GT. NOUTM (',NOUT,').'
         STOP
      ENDIF
C      READ(20,'(10F8.3)',ERR=1000,END=1000) (VLOCAL(I),I=1,NPLWV)
      READ(20,*,ERR=1000,END=1000) (VLOCAL(I),I=1,NPLWV)
      WRITE(*,*) 'charge density read'
      CLOSE(20)
      DO 20 I=1,NOUTM
   20 VAV(I)=0.
      SCALE=1./FLOAT(NPLWV/NOUT)
      WRITE(*,*) SCALE
      IF (IDIR.EQ.1) THEN
         DO 150 IX=1,NGX
            DO 100 IZ=1,NGZ
             DO 100 IY=1,NGY
               IPL=IX+((IY-1)+(IZ-1)*NGY)*NGX
               VAV(IX)=VAV(IX)+VLOCAL(IPL)*SCALE
  100       CONTINUE
  150    CONTINUE
      ELSE IF (IDIR.EQ.2) THEN
         DO 250 IY=1,NGY
            DO 200 IZ=1,NGZ
             DO 200 IX=1,NGX
               IPL=IX+((IY-1)+(IZ-1)*NGY)*NGX
               VAV(IY)=VAV(IY)+VLOCAL(IPL)*SCALE
  200       CONTINUE
  250    CONTINUE
      ELSE IF (IDIR.EQ.3) THEN
         DO 350 IZ=1,NGZ
            DO 300 IY=1,NGY
             DO 300 IX=1,NGX
               IPL=IX+((IY-1)+(IZ-1)*NGY)*NGX
               VAV(IZ)=VAV(IZ)+VLOCAL(IPL)*SCALE
  300       CONTINUE
  350    CONTINUE
      ELSE
         WRITE(*,*) 'Hmmm?? Wrong IDIR ',IDIR
         STOP
      ENDIF
      OPEN(20,FILE='VLINE')
      WRITE(20,*) NOUT,IDIR
      DO 500 I=1,NOUT
         WRITE(20,'(I6,2X,E18.11)') I,VAV(I)
  500 CONTINUE
      CLOSE(20)

      STOP
 1000 WRITE(*,*) 'Error opening or reading file LOCPOT.'
      WRITE(*,*) 'item :',I
      STOP
      END
