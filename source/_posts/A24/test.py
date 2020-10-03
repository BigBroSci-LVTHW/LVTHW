from pymatgen_diffusion.aimd.pathway import ProbabilityDensityAnalysis
from pymatgen.core.trajectory import Trajectory
from pymatgen.io.vasp.outputs import Xdatcar
from pymatgen.analysis.diffusion_analyzer import DiffusionAnalyzer

print('traj\n')
traj = Trajectory.from_file('XDATCAR')
print('diff\n')
diff = DiffusionAnalyzer.from_structures(traj,'Li',900,2,1)
print('pda\n')
pda = ProbabilityDensityAnalysis.from_diffusion_analyzer(diff,interval=0.5,species=("Li"))
pda.to_chgcar(filename="pda.vasp") #保存概率密度文件
