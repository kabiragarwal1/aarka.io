from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional


class ChannelType(str, Enum):
    SOCIAL = "social"
    OTT = "ott"
    DISPLAY = "display"
    AI_PLACEMENT = "ai_placement"


class Region(str, Enum):
    US = "us"
    EU = "eu"
    APAC = "apac"
    LATAM = "latam"
    MEA = "mea"


@dataclass(slots=True)
class Channel:
    id: str
    name: str
    type: ChannelType
    supports_auto_optimization: bool = True


@dataclass(slots=True)
class ComplianceSettings:
    hipaa_mode: bool = False
    gdpr_mode: bool = True
    pii_detection: bool = True
    require_consent_for_tracking: bool = True


@dataclass(slots=True)
class ContentAsset:
    id: str
    title: str
    body: str
    language: str
    created_at: datetime = field(default_factory=datetime.utcnow)
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, str] = field(default_factory=dict)


@dataclass(slots=True)
class Translation:
    source_asset_id: str
    target_language: str
    localized_title: str
    localized_body: str


@dataclass(slots=True)
class PublicationPlan:
    asset_id: str
    target_channels: List[str]
    target_regions: List[Region]
    scheduled_for: Optional[datetime] = None
    auto_manage: bool = True


@dataclass(slots=True)
class PublicationRecord:
    plan_id: str
    asset_id: str
    channel_id: str
    region: Region
    language: str
    published_at: datetime
    status: str
    advisory_notes: List[str] = field(default_factory=list)


@dataclass(slots=True)
class AnalyticsPoint:
    publication_id: str
    impressions: int
    clicks: int
    conversions: int
    spend_usd: float

    @property
    def ctr(self) -> float:
        return self.clicks / self.impressions if self.impressions else 0.0

    @property
    def conversion_rate(self) -> float:
        return self.conversions / self.clicks if self.clicks else 0.0


@dataclass(slots=True)
class OptimizationSuggestion:
    publication_id: str
    recommendation: str
    expected_impact: str
